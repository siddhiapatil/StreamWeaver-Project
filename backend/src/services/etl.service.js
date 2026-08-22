/**
 * ---------------------------------------------------------
 * ETL Service
 * ---------------------------------------------------------
 * Connects Extract -> Transform -> Load with stage-aware error handling
 * and performance benchmarking / execution logging.
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
 * Executes the complete ETL Pipeline with logging, timing, and stage-level error management.
 *
 * @param {Object} pipelineConfig - Source, transformation, and destination configurations
 * @returns {Promise<Object>} Execution report (Success or Failed)
 */
const runFullETLPipeline = async (pipelineConfig) => {
    const { source, transformation = {}, destination = {} } = pipelineConfig;
    const startTime = Date.now();
    const logs = [];
    let currentStage = "Extract";

    logs.push(`[${new Date().toISOString()}] Pipeline execution initiated.`);

    try {
        // --- STAGE 1: EXTRACT ---
        currentStage = "Extract";
        logs.push(`[${new Date().toISOString()}] Starting Extract stage for file: ${source.sourcePath || source.path}`);
        
        const rawCSV = await extractCSV({
            type: source.sourceType || source.type || "csv",
            path: source.sourcePath || source.path
        });
        logs.push(`[${new Date().toISOString()}] Extract stage completed successfully.`);

        // --- STAGE 2: TRANSFORM ---
        currentStage = "Transform";
        logs.push(`[${new Date().toISOString()}] Starting Transform stage with rules: ${JSON.stringify(transformation)}`);
        
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
        logs.push(`[${new Date().toISOString()}] Transform stage completed. Total records transformed: ${transformedRecords.length}`);

        // --- STAGE 3: LOAD ---
        currentStage = "Load";
        logs.push(`[${new Date().toISOString()}] Starting Load stage to destination: ${destination.path || "default"}`);
        
        const loadResult = await loadData(transformedRecords, destination);
        logs.push(`[${new Date().toISOString()}] Load stage completed successfully.`);

        const executionTimeMs = Date.now() - startTime;
        logs.push(`[${new Date().toISOString()}] Pipeline completed in ${executionTimeMs}ms.`);

        return {
            status: "Success",
            failedStage: null,
            error: null,
            executionTimeMs,
            recordsProcessed: transformedRecords.length,
            source: {
                type: source.sourceType || source.type || "csv",
                path: source.sourcePath || source.path
            },
            appliedTransformations: transformation,
            destination: loadResult,
            logs
        };
    } catch (error) {
        const executionTimeMs = Date.now() - startTime;
        logs.push(`[${new Date().toISOString()}] Pipeline failed at stage '${currentStage}': ${error.message}`);

        return {
            status: "Failed",
            failedStage: currentStage,
            error: error.message,
            executionTimeMs,
            recordsProcessed: 0,
            source: source,
            destination: null,
            logs
        };
    }
};

module.exports = {
    prepareSource,
    runFullETLPipeline
};