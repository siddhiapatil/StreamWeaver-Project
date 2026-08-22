/**
 * ---------------------------------------------------------
 * Express Application Configuration
 * ---------------------------------------------------------
 * Initializes middleware, routes, and error handling.
 */

const express = require("express");
const uploadRoutes = require("./routes/upload.routes");
const etlRoutes = require("./routes/etl.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Body Parser Middleware
app.use(express.json());

// Base Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "StreamWeaver Backend is running"
    });
});

// Mount Application Routes
app.use("/api", uploadRoutes);
app.use("/api", etlRoutes);

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;