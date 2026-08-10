/**
 * ---------------------------------------------------------
 * ETL Controller
 * ---------------------------------------------------------
 * Receives ETL requests,
 * calls the ETL service,
 * and sends the response back to the client.
 */


console.log("ETL CONTROLLER LOADED");

const processETL = (req, res) => {
    res.json({
        success: true,
        message: "ETL module working"
    });
};

module.exports = {
    processETL
};