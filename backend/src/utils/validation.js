/**
 * ---------------------------------------------------------
 * Validation Utilities
 * ---------------------------------------------------------
 * Provides validation functions for input data
 */

import { ERROR_CODES, MAX_MAPPINGS, DEFAULT_BATCH_SIZE, MAX_BATCH_SIZE } from '../config/constants.js';

export class ValidationError extends Error {
    constructor(message, code = ERROR_CODES.VALIDATION_ERROR) {
        super(message);
        this.name = 'ValidationError';
        this.code = code;
        this.status = 400;
    }
}

/**
 * Validate pipeline payload
 */
export function validatePipelinePayload(payload) {
    if (!payload) throw new ValidationError('Pipeline payload is required');

    const { name, description, mappings, batchSize } = payload;

    // Validate name
    if (!name || typeof name !== 'string' || !name.trim()) {
        throw new ValidationError('Pipeline name is required and must be a non-empty string');
    }

    const trimmedName = name.trim();
    if (trimmedName.length > 255) {
        throw new ValidationError('Pipeline name must not exceed 255 characters');
    }

    // Validate description
    const trimmedDescription = description?.trim() || '';
    if (trimmedDescription.length > 1000) {
        throw new ValidationError('Pipeline description must not exceed 1000 characters');
    }

    // Validate mappings
    if (!Array.isArray(mappings) || mappings.length === 0) {
        throw new ValidationError('At least one mapping is required');
    }

    if (mappings.length > MAX_MAPPINGS) {
        throw new ValidationError(`Maximum ${MAX_MAPPINGS} mappings allowed`);
    }

    const validatedMappings = mappings.map((mapping, index) => {
        if (!mapping.source || typeof mapping.source !== 'string') {
            throw new ValidationError(`Mapping ${index}: source field is required and must be a string`);
        }
        if (!mapping.destination || typeof mapping.destination !== 'string') {
            throw new ValidationError(`Mapping ${index}: destination field is required and must be a string`);
        }

        return {
            source: mapping.source.trim(),
            destination: mapping.destination.trim(),
            transform: (mapping.transform || '').trim()
        };
    });

    // Validate batchSize
    let validatedBatchSize = DEFAULT_BATCH_SIZE;
    if (batchSize !== undefined) {
        if (typeof batchSize !== 'number' || batchSize < 100 || batchSize > MAX_BATCH_SIZE) {
            throw new ValidationError(`Batch size must be between 100 and ${MAX_BATCH_SIZE}`);
        }
        validatedBatchSize = batchSize;
    }

    return {
        name: trimmedName,
        description: trimmedDescription,
        mappings: validatedMappings,
        batchSize: validatedBatchSize
    };
}

/**
 * Validate pipeline run payload
 */
export function validatePipelineRunPayload(payload) {
    if (!payload) throw new ValidationError('Run payload is required');

    const { sourceJobId } = payload;

    if (!sourceJobId || typeof sourceJobId !== 'string' || !sourceJobId.trim()) {
        throw new ValidationError('Source job ID is required and must be a non-empty string');
    }

    return {
        sourceJobId: sourceJobId.trim()
    };
}

/**
 * Validate credentials
 */
export function validateCredentials(credentials) {
    if (!credentials) return 'Credentials are required';

    const { email, password } = credentials;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email || '')) {
        return 'A valid email is required';
    }

    if (typeof password !== 'string' || password.length < 8) {
        return 'Password must be at least 8 characters';
    }

    return null; // No errors
}
