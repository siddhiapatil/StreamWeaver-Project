/**
 * ---------------------------------------------------------
 * CSV Parser Utility
 * ---------------------------------------------------------
 * Reads CSV files,
 * parses rows,
 * and converts them into usable data.
 */

const fs = require("fs");

/**
 * Reads a CSV file using a stream.
 *
 * @param {string} filePath - Path of the CSV file
 * @returns {Promise<string>} File content
 */
const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        let data = "";

        const readStream = fs.createReadStream(filePath, {
            encoding: "utf8"
        });

        readStream.on("data", (chunk) => {
            data += chunk;
        });

        readStream.on("end", () => {
            resolve(data);
        });

        readStream.on("error", (error) => {
            reject(error);
        });
    });
};

module.exports = {
    readCSV
};