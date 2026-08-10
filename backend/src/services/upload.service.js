/**
 * ---------------------------------------------------------
 * Upload Service
 * ---------------------------------------------------------
 * Handles the actual file upload process.
 *
 * Responsibilities:
 * - Create the uploads directory if required
 * - Receive the uploaded file stream
 * - Save the file to disk
 * - Track upload progress
 */

const Busboy = require("busboy");
const fs = require("fs");
const path = require("path");

/**
 * Processes an incoming multipart/form-data upload.
 *
 * @param {Object} req - Express request object
 * @returns {Promise<Object>} Uploaded file information
 */
const handleFileUpload = (req) => {
    return new Promise((resolve, reject) => {
        const uploadDir = path.join(__dirname, "../../uploads");

        // Create uploads directory if it does not exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const busboy = Busboy({
            headers: req.headers
        });

        let uploadedFileName = "";
        let uploadedFilePath = "";

        busboy.on("file", (fieldname, file, info) => {
            const { filename } = info;

            uploadedFileName = filename;
            uploadedFilePath = path.join(uploadDir, filename);

            const writeStream = fs.createWriteStream(uploadedFilePath);

            // Stream the uploaded file directly to disk
            file.pipe(writeStream);

            file.on("data", (chunk) => {
                console.log(`Received chunk: ${chunk.length} bytes`);
            });

            file.on("end", () => {
                console.log(`Upload completed: ${filename}`);
            });

            file.on("error", (error) => {
                reject(error);
            });

            writeStream.on("error", (error) => {
                reject(error);
            });
        });

        busboy.on("finish", () => {
            resolve({
                filename: uploadedFileName,
                path: uploadedFilePath
            });
        });

        busboy.on("error", (error) => {
            reject(error);
        });

        req.pipe(busboy);
    });
};

module.exports = {
    handleFileUpload
};