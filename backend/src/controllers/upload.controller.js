/**
 * ---------------------------------------------------------
 * Upload Controller
 * ---------------------------------------------------------
 * Handles incoming file upload requests.
 *
 * Responsibilities:
 * - Call the upload service
 * - Return a response to the client
 * - Forward errors to the error-handling middleware
 */

import { handleFileUpload } from '../services/upload.service.js';

/**
 * Handles file upload requests.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const uploadFile = async (req, res, next) => {
    try {
        const result = await handleFileUpload(req);

        res.json({
            success: true,
            message: 'File uploaded successfully',
            jobId: result.jobId,
            filename: result.filename,
            size: result.size
        });
    } catch (error) {
        next(error);
    }
};
