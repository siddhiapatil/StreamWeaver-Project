/**
 * ---------------------------------------------------------
 * ETL Controller
 * ---------------------------------------------------------
 * Receives ETL requests,
 * calls the ETL service,
 * and sends the response back to the client.
 */

const { prepareSource } = require("../services/etl.service");

const processETL = (req, res) => {
    const source = prepareSource(req.body);

    res.json({
        success: true,
        message: "ETL module working",
        source: source
    });
};

module.exports = {
    processETL
};