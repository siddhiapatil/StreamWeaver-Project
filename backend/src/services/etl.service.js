/**
 * ---------------------------------------------------------
 * ETL Service
 * ---------------------------------------------------------
 * Connects the full Extract -> Transform (with Filters) -> Load pipeline.
 */

const { Readable } = require("stream");
const { extractCSV } = require("../etl/extract");
const { CSVToJSONTransform } = require("../etl/transform");
const { loadData } = require("../etl/load");

/**
 * Prepares the source details from the API request body.
 */
const prepareSource = (sourceData = {}) => {
    return {
        sourceType: sourceData.sourceType || sourceData.type || "csv",
        sourcePath: sourceData.sourcePath || sourceData.path || ""
    };
};

/**
 * Executes the complete end-to-end ETL Pipeline with customizable transformations.
 *
 * @param {Object} pipelineConfig - Contains source, transformation, and destination configs
 * @returns {Promise<Object>} Execution summary
 */
const runFullETLPipeline = async (pipelineConfig) => {
    const { source, transformation = {}, destination = {} } = pipelineConfig;

    // Step 1: Extract CSV source data
    const rawCSV = await extractCSV({
        type: source.sourceType || source.type || "csv",
        path: source.sourcePath || source.path
    });

    // Step 2: Stream Transform CSV rows into JSON objects with filtering
    const transformedRecords = await new Promise((resolve, reject) => {
        const inputStream = Readable.from([rawCSV]);
        const transformStream = new CSVToJSONTransform({
            transformRules: transformation
        });
        const records = [];

        transformStream.on("data", (row) => {
            records.push(row);
        });

        transformStream.on("end", () => {
            resolve(records);
        });

        transformStream.on("error", (err) => {
            reject(err);
        });

        inputStream.pipe(transformStream);
    });

    // Step 3: Load transformed records into destination
    const loadResult = await loadData(transformedRecords, destination);

    return {
        status: "Success",
        recordsProcessed: transformedRecords.length,
        source: {
            type: source.sourceType || source.type || "csv",
            path: source.sourcePath || source.path
        },
        appliedTransformations: transformation,
        destination: loadResult
    };
};

module.exports = {
    prepareSource,
    runFullETLPipeline
};