/**
 * ---------------------------------------------------------
 * ETL Controller
 * ---------------------------------------------------------
 * Receives pipeline requests, invokes the ETL service,
 * and returns the execution report to the client.
 */

const { runFullETLPipeline } = require("../services/etl.service");

/**
 * Handles POST /api/etl/process requests to run the ETL pipeline.
 */
const processETL = async (req, res, next) => {
    try {
        const { source, transformation, destination } = req.body;

        // Validation: Verify source configuration is present
        if (!source || (!source.sourcePath && !source.path)) {
            return res.status(400).json({
                success: false,
                message: "Source configuration with 'sourcePath' or 'path' is required"
            });
        }

        // Trigger the unified ETL pipeline with transformation rules
        const result = await runFullETLPipeline({
            source,
            transformation: transformation || {},
            destination: destination || {}
        });

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