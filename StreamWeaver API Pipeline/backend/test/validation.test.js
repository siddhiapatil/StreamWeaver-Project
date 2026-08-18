import test from 'node:test';
import assert from 'node:assert/strict';
import { validatePipelinePayload } from '../src/utils/validation.js';

test('accepts a valid payload and trims/normalizes it', () => {
  const result = validatePipelinePayload({
    name: '  Customer import  ',
    description: '  Loads customer CSVs  ',
    mappings: [{ source: ' first_name ', destination: ' firstName ' }]
  });
  assert.equal(result.name, 'Customer import');
  assert.equal(result.description, 'Loads customer CSVs');
  assert.deepEqual(result.mappings, [{ source: 'first_name', destination: 'firstName', transform: '' }]);
  assert.equal(result.batchSize, 1000);
});

test('accepts a custom batchSize within range', () => {
  const result = validatePipelinePayload({
    name: 'Batch test',
    mappings: [{ source: 'a', destination: 'b' }],
    batchSize: 250
  });
  assert.equal(result.batchSize, 250);
});

test('rejects a missing name', () => {
  assert.throws(
    () => validatePipelinePayload({ mappings: [{ source: 'a', destination: 'b' }] }),
    /name is required/
  );
});

test('rejects an empty mappings array', () => {
  assert.throws(() => validatePipelinePayload({ name: 'Empty' }), /mappings must be a non-empty array/);
});

test('rejects a mapping missing a destination', () => {
  assert.throws(
    () => validatePipelinePayload({ name: 'Bad mapping', mappings: [{ source: 'a' }] }),
    /destination is required/
  );
});

test('rejects a mapping with a non-string transform', () => {
  assert.throws(
    () => validatePipelinePayload({
      name: 'Bad transform',
      mappings: [{ source: 'a', destination: 'b', transform: 123 }]
    }),
    /transform must be a string/
  );
});

test('rejects an out-of-range batchSize', () => {
  assert.throws(
    () => validatePipelinePayload({ name: 'Bad batch', mappings: [{ source: 'a', destination: 'b' }], batchSize: 0 }),
    /batchSize must be an integer/
  );
});

test('rejects more mappings than the configured maximum', () => {
  const mappings = Array.from({ length: 201 }, (_, i) => ({ source: `s${i}`, destination: `d${i}` }));
  assert.throws(
    () => validatePipelinePayload({ name: 'Too many', mappings }),
    /mappings cannot exceed/
  );
});

test('the thrown error carries a 400 status for the route layer to use', () => {
  try {
    validatePipelinePayload({});
    assert.fail('expected validatePipelinePayload to throw');
  } catch (error) {
    assert.equal(error.status, 400);
    assert.equal(error.expose, true);
  }
});
