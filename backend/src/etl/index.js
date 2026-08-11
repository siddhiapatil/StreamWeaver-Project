/**
 * ---------------------------------------------------------
 * ETL Pipeline
 * ---------------------------------------------------------
 * Coordinates the complete
 * Extract → Transform → Load workflow.
 */

const { createSource } = require("./extract");
const { transformData } = require("./transform");
const { loadData } = require("./load");

/**
 * Creates the basic ETL pipeline structure.
 *
 * @param {Object} sourceConfig - Source configuration
 * @returns {Object} ETL pipeline information
 */
const createETLPipeline = (sourceConfig) => {
    const source = createSource(sourceConfig);

    return {
        source,
        stages: [
            "Extract",
            "Transform",
            "Load"
        ]
    };
};

module.exports = {
    createETLPipeline,
    transformData,
    loadData
};