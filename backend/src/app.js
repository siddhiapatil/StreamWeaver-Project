/**
 * ---------------------------------------------------------
 * Express Application Configuration
 * ---------------------------------------------------------
 * Configures middleware, routes, and application settings.
 * This file initializes the Express app.
 */



const express = require("express");
const uploadRoutes = require("./routes/upload.routes");
const etlRoutes = require("./routes/etl.routes");
const errorHandler = require("./middleware/errorHandler");
console.log("APP.JS LOADED");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "StreamWeaver Backend is running"
    });
});

app.use("/api", uploadRoutes);
app.use("/api", etlRoutes);

app.use(errorHandler);

module.exports = app;