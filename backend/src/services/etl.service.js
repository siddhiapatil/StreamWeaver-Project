/**
 * ---------------------------------------------------------
 * ETL Service
 * ---------------------------------------------------------
 * Connects Extract -> Transform -> Load with stage-aware error handling.
 */

const { Readable } = require("stream");
const { extractCSV } = require("../etl/extract");
const { CSVToJSONTransform } = require("../etl/transform");
const { loadData } = require("../etl/load");

/**
 * Normalizes source configuration payload.
 */
const prepareSource = (sourceData = {}) => {
    return {
        sourceType: sourceData.sourceType || sourceData.type || "csv",
        sourcePath: sourceData.sourcePath || sourceData.path || ""
    };
};

/**
 * Executes the complete ETL Pipeline with stage-level error management.
 *
 * @param {Object} pipelineConfig - Source, transformation, and destination configurations
 * @returns {Promise<Object>} Execution result (Success or Failed)
 */
const runFullETLPipeline = async (pipelineConfig) => {
    const { source, transformation = {}, destination = {} } = pipelineConfig;
    let currentStage = "Extract";

    try {
        // --- STAGE 1: EXTRACT ---
        currentStage = "Extract";
        const rawCSV = await extractCSV({
            type: source.sourceType || source.type || "csv",
            path: source.sourcePath || source.path
        });

        // --- STAGE 2: TRANSFORM ---
        currentStage = "Transform";
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
                reject(new Error(`[Transform Stage] Stream transformation failed: ${err.message}`));
            });

            inputStream.pipe(transformStream);
        });

        // --- STAGE 3: LOAD ---
        currentStage = "Load";
        const loadResult = await loadData(transformedRecords, destination);

        return {
            status: "Success",
            failedStage: null,
            error: null,
            recordsProcessed: transformedRecords.length,
            source: {
                type: source.sourceType || source.type || "csv",
                path: source.sourcePath || source.path
            },
            appliedTransformations: transformation,
            destination: loadResult
        };
    } catch (error) {
        return {
            status: "Failed",
            failedStage: currentStage,
            error: error.message,
            recordsProcessed: 0,
            source: source,
            destination: null
        };
    }
};

module.exports = {
    prepareSource,
    runFullETLPipeline
};