import { Router } from 'express';
import Busboy from 'busboy';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { processCsv } from '../services/etlPipeline.js';

export function etlRouter({ uploadDir, io }) {
  const router = Router();
  router.post('/upload', (req, res, next) => {
    const jobId = crypto.randomUUID();
    const target = path.resolve(uploadDir, `${jobId}.csv`);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const busboy = Busboy({ headers: req.headers, limits: { files: 1, fileSize: 10 * 1024 ** 3 } });
    let receivedFile = false;
    busboy.on('file', (_, stream, info) => {
      if (info.mimeType !== 'text/csv' && !info.filename.endsWith('.csv')) return stream.resume();
      receivedFile = true; stream.pipe(fs.createWriteStream(target));
    });
    busboy.on('finish', () => receivedFile ? res.status(202).json({ jobId, file: target }) : res.status(400).json({ error: 'A CSV file is required.' }));
    busboy.on('error', next); req.pipe(busboy);
  });
  router.post('/:jobId/process', async (req, res, next) => {
    try {
      const file = path.resolve(uploadDir, `${req.params.jobId}.csv`);
      if (!file.startsWith(path.resolve(uploadDir)) || !fs.existsSync(file)) return res.status(404).json({ error: 'Upload not found.' });
      const mappings = Array.isArray(req.body.mappings) ? req.body.mappings : [];
      if (!mappings.length || mappings.some((m) => !m.source || !m.destination)) return res.status(400).json({ error: 'At least one valid column mapping is required.' });
      const emit = (data) => io.emit(`etl:${req.params.jobId}`, { jobId: req.params.jobId, ...data });
      emit({ status: 'started' });
      const collection = mongoose.connection.db.collection(`etl_${req.params.jobId.replaceAll('-', '')}`);
      const result = await processCsv({ source: fs.createReadStream(file), collection, mappings, onProgress: emit });
      emit({ status: 'complete', ...result }); res.json({ jobId: req.params.jobId, ...result });
    } catch (error) { next(error); }
  });
  return router;
}
