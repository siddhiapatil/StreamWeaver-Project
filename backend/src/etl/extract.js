/**
 * ---------------------------------------------------------
 * Extract Module
 * ---------------------------------------------------------
 * Defines the source component of the ETL pipeline.
 *
 * Responsibilities:
 * - Identify the input source
 * - Support CSV and JSON source types
 * - Prepare source information for extraction
 *
 * Actual file reading will be implemented in the next task.
 */

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

module.exports = {
    createSource
};