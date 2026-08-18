import { AppError } from './AppError.js';

const NAME_MAX_LENGTH = 120;
const DESCRIPTION_MAX_LENGTH = 500;
const MAX_MAPPINGS = 200;
const DEFAULT_BATCH_SIZE = 1000;

/**
 * Validates and normalizes a pipeline configuration payload.
 *
 * @param {Object} body - Raw request body (req.body).
 * @returns {{name: string, description: string, mappings: Array, batchSize: number}}
 * @throws {AppError} 400 error listing every validation problem found.
 */
export function validatePipelinePayload(body = {}) {
  const errors = [];

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (!name) errors.push('name is required.');
  else if (name.length > NAME_MAX_LENGTH) errors.push(`name must be ${NAME_MAX_LENGTH} characters or fewer.`);

  const description = typeof body.description === 'string' ? body.description.trim() : '';
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.push(`description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`);
  }

  const mappings = Array.isArray(body.mappings) ? body.mappings : null;
  if (!mappings || mappings.length === 0) {
    errors.push('mappings must be a non-empty array.');
  } else if (mappings.length > MAX_MAPPINGS) {
    errors.push(`mappings cannot exceed ${MAX_MAPPINGS} entries.`);
  } else {
    mappings.forEach((mapping, index) => {
      if (!mapping || typeof mapping !== 'object') {
        errors.push(`mappings[${index}] must be an object.`);
        return;
      }
      if (!mapping.source || typeof mapping.source !== 'string') {
        errors.push(`mappings[${index}].source is required.`);
      }
      if (!mapping.destination || typeof mapping.destination !== 'string') {
        errors.push(`mappings[${index}].destination is required.`);
      }
      if (mapping.transform !== undefined && typeof mapping.transform !== 'string') {
        errors.push(`mappings[${index}].transform must be a string.`);
      }
    });
  }

  let batchSize = DEFAULT_BATCH_SIZE;
  if (body.batchSize !== undefined) {
    batchSize = Number(body.batchSize);
    if (!Number.isInteger(batchSize) || batchSize < 1 || batchSize > 10000) {
      errors.push('batchSize must be an integer between 1 and 10000.');
    }
  }

  if (errors.length) throw new AppError(errors.join(' '), 400);

  return {
    name,
    description,
    mappings: mappings.map((mapping) => ({
      source: mapping.source.trim(),
      destination: mapping.destination.trim(),
      transform: typeof mapping.transform === 'string' ? mapping.transform : ''
    })),
    batchSize
  };
}
