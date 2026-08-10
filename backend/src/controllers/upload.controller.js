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

const { handleFileUpload } = require("../services/upload.service");

/**
 * Handles file upload requests.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const uploadFile = async (req, res, next) => {
    try {
        const result = await handleFileUpload(req);

        res.json({
            success: true,
            message: "File uploaded successfully",
            filename: result.filename
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadFile
};