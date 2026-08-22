/**
 * ---------------------------------------------------------
 * ETL Controller
 * ---------------------------------------------------------
 * Receives pipeline requests, invokes the ETL service,
 * and standardizes the API response formats.
 */

const { runFullETLPipeline } = require("../services/etl.service");

/**
 * Handles POST /api/etl/process
 */
const processETL = async (req, res, next) => {
    try {
        const { source, transformation, destination } = req.body;

        // Input validation: source path presence
        if (!source || (!source.sourcePath && !source.path)) {
            return res.status(400).json({
                success: false,
                message: "Source configuration with 'sourcePath' or 'path' is required"
            });
        }

        // Run full ETL pipeline
        const result = await runFullETLPipeline({
            source,
            transformation: transformation || {},
            destination: destination || {}
        });

        // Check if pipeline failed internally
        if (result.status === "Failed") {
            return res.status(422).json({
                success: false,
                message: `ETL Pipeline failed during '${result.failedStage}' stage`,
                data: result
            });
        }

        return res.status(200).json({
            success: true,
            message: "ETL Pipeline executed successfully",
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    processETL
};