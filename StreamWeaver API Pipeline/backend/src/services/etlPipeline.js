import { Transform, Writable, pipeline } from 'node:stream';
import { promisify } from 'node:util';
import { parse } from 'csv-parse';
import { transformValue } from './sandbox.js';

const pipe = promisify(pipeline);

class RowMapper extends Transform {
  constructor({ mappings, onProgress }) { super({ objectMode: true }); this.mappings = mappings; this.onProgress = onProgress; this.processed = 0; }
  async _transform(row, _, done) {
    try {
      const result = {};
      for (const mapping of this.mappings) {
        const raw = row[mapping.source];
        result[mapping.destination] = await transformValue(mapping.transform, raw, row);
      }
      this.processed += 1;
      if (this.processed % 100 === 0) this.onProgress?.({ processed: this.processed });
      done(null, result);
    } catch (error) { done(error); }
  }
}

class BulkWriter extends Writable {
  constructor({ collection, batchSize, onProgress }) { super({ objectMode: true }); this.collection = collection; this.batchSize = batchSize; this.onProgress = onProgress; this.batch = []; this.inserted = 0; }
  async _write(row, _, done) { try { this.batch.push(row); if (this.batch.length >= this.batchSize) await this.flush(); done(); } catch (error) { done(error); } }
  async _final(done) { try { await this.flush(); done(); } catch (error) { done(error); } }
  async flush() {
    if (!this.batch.length) return;
    const operations = this.batch.map((document) => ({ insertOne: { document } }));
    await this.collection.bulkWrite(operations, { ordered: false });
    this.inserted += this.batch.length; this.batch = [];
    this.onProgress?.({ inserted: this.inserted });
  }
}

export async function processCsv({ source, collection, mappings, onProgress, batchSize = 1000 }) {
  const mapper = new RowMapper({ mappings, onProgress });
  const writer = new BulkWriter({ collection, batchSize, onProgress });
  await pipe(source, parse({ columns: true, bom: true, skip_empty_lines: true, trim: true }), mapper, writer);
  return { processed: mapper.processed, inserted: writer.inserted };
}
