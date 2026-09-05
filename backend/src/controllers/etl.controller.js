/**
 * ---------------------------------------------------------
 * ETL Controller
 * ---------------------------------------------------------
 * Receives ETL requests,
 * calls the ETL service,
 * and sends the response back to the client.
 */

export const processETL = (req, res) => {
    res.json({
        success: true,
        message: 'ETL module working'
    });
};
