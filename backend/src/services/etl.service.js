/**
 * ---------------------------------------------------------
 * ETL Service
 * ---------------------------------------------------------
 * Connects the Extract and Transform stages
 * of the ETL pipeline.
 */

const { Readable } = require("stream");
const { extractCSV } = require("../etl/extract");
const { CSVToJSONTransform } = require("../etl/transform");

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

/**
 * Connect the CSV source to the transformation stage.
 *
 * Flow:
 * Source → Extract → Transform
 *
 * @param {Object} sourceConfig - CSV source configuration
 * @returns {Promise<Array>} Transformed records
 */
const processSourceToTransform = async (sourceConfig) => {
    const csvData = await extractCSV({
        type: sourceConfig.sourceType,
        path: sourceConfig.sourcePath
    });

    return new Promise((resolve, reject) => {
        const input = Readable.from([csvData]);
        const transform = new CSVToJSONTransform();
        const transformedData = [];

        transform.on("data", (row) => {
            transformedData.push(row);
        });

        transform.on("end", () => {
            resolve(transformedData);
        });

        transform.on("error", (error) => {
            reject(error);
        });

        input.pipe(transform);
    });
};

module.exports = {
    prepareSource,
    processSourceToTransform
};