/**
 * ---------------------------------------------------------
 * ETL Routes
 * ---------------------------------------------------------
 * Defines API endpoints for ETL processing operations.
 */

const express = require("express");
const router = express.Router();

console.log("ETL ROUTES LOADED");

const { processETL } = require("../controllers/etl.controller");

router.post("/etl/process", processETL);

module.exports = router;