/**
 * ---------------------------------------------------------
 * Application Constants
 * ---------------------------------------------------------
 * Stores reusable application constants,
 * such as API paths, default values,
 * and configuration settings.
 */

export const PIPELINE_RUN_STATUS = Object.freeze({
    RUNNING: 'RUNNING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    PENDING: 'PENDING'
});

export const DEFAULT_BATCH_SIZE = 1000;
export const MAX_BATCH_SIZE = 10000;
export const MAX_MAPPINGS = 200;
export const MAX_ROWS_PER_RUN = 60000;

export const ERROR_CODES = Object.freeze({
    INVALID_INPUT: 'INVALID_INPUT',
    FILE_NOT_FOUND: 'FILE_NOT_FOUND',
    CSV_REQUIRED: 'CSV_REQUIRED',
    PIPELINE_NOT_FOUND: 'PIPELINE_NOT_FOUND',
    RUN_NOT_FOUND: 'RUN_NOT_FOUND',
    TRANSFORMATION_ERROR: 'TRANSFORMATION_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
});

export const HTTP_STATUS = Object.freeze({
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
});
