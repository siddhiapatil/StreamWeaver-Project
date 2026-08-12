/**
 * ---------------------------------------------------------
 * Extract Module
 * ---------------------------------------------------------
 * Defines the source component of the ETL pipeline.
 *
 * Responsibilities:
 * - Identify the input source
 * - Read CSV source data
 * - Prepare source information for the ETL pipeline
 */

const { readCSV } = require("../utils/csvParser");

/**
 * Creates a source configuration for the ETL pipeline.
 *
 * @param {Object} sourceConfig - Source configuration
 * @returns {Object} Prepared source configuration
 */
const createSource = (sourceConfig) => {
    return {
        type: sourceConfig.type,
        path: sourceConfig.path || null
    };
};

/**
 * Reads data from the configured CSV source.
 *
 * @param {Object} sourceConfig - Source configuration
 * @returns {Promise<string>} CSV data
 */
const extractCSV = async (sourceConfig) => {
    if (sourceConfig.type !== "csv") {
        throw new Error("Only CSV source is supported currently");
    }

    if (!sourceConfig.path) {
        throw new Error("CSV source path is required");
    }

    return await readCSV(sourceConfig.path);
};

module.exports = {
    createSource,
    extractCSV
};