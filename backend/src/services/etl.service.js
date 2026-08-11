/**
 * ---------------------------------------------------------
 * ETL Service
 * ---------------------------------------------------------
 * Contains the core ETL processing logic.
 * This service will handle source data processing.
 */

/**
 * Prepare the source information for ETL processing.
 *
 * @param {Object} sourceData - Source information received from the API
 * @returns {Object} Prepared source information
 */
const prepareSource = (sourceData) => {
    return {
        sourceType: sourceData.sourceType,
        sourcePath: sourceData.sourcePath
    };
};

module.exports = {
    prepareSource
};