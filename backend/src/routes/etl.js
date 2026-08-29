import { Router } from 'express';
import Busboy from 'busboy';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import { processCsv } from '../services/etlPipeline.js';
import { AppError } from '../utils/AppError.js';
import { SourceUpload } from '../models/SourceUpload.js';
export function etlRouter({ uploadDir, io, logger }) {
  const router = Router();
  router.post('/upload', (req, res, next) => {
    const jobId = crypto.randomUUID(); const root = path.resolve(uploadDir); const target = path.resolve(root, `${jobId}.csv`); fs.mkdirSync(root, { recursive: true });
    const busboy = Busboy({ headers: req.headers, limits: { files: 1, fileSize: 10 * 1024 ** 3 } }); let received = false; let originalName = ''; let writePromise = Promise.resolve();
    busboy.on('file', (_, stream, info) => { if (info.mimeType !== 'text/csv' && !info.filename.toLowerCase().endsWith('.csv')) return stream.resume(); received = true; originalName = info.filename; const writer = fs.createWriteStream(target, { flags: 'wx' }); writePromise = new Promise((resolve, reject) => { writer.on('finish', resolve); writer.on('error', reject); stream.on('error', reject); }); stream.pipe(writer); });
    busboy.on('finish', async () => { try { if (!received) return res.status(400).json({ success: false, error: { code: 'CSV_REQUIRED', message: 'A CSV file is required.' } }); await writePromise; await SourceUpload.create({ jobId, owner: req.user.sub, originalName }); logger?.info('source.upload.completed', { jobId, ownerId: req.user.sub }); res.status(202).json({ success: true, jobId, message: 'CSV upload completed.' }); } catch (error) { next(error); } }); busboy.on('error', next); req.pipe(busboy);
  });
  router.post('/:jobId/process', async (req, res, next) => { try { const root = path.resolve(uploadDir); const file = path.resolve(root, `${req.params.jobId}.csv`); if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) throw new AppError('Upload not found.', 404, 'UPLOAD_NOT_FOUND'); const mappings = Array.isArray(req.body.mappings) ? req.body.mappings : []; if (!mappings.length || mappings.some(m => !m.source || !m.destination)) throw new AppError('At least one valid column mapping is required.', 400, 'VALIDATION_ERROR'); const emit = data => io?.emit(`etl:${req.params.jobId}`, { jobId: req.params.jobId, ...data }); emit({ status: 'started' }); const collection = mongoose.connection.db.collection(`etl_${req.params.jobId.replaceAll('-', '')}`); const result = await processCsv({ source: fs.createReadStream(file), collection, mappings, onProgress: emit }); emit({ status: 'complete', ...result }); res.json({ success: true, jobId: req.params.jobId, ...result }); } catch (error) { next(error); } });
  return router;
}
