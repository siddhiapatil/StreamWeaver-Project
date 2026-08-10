/**
 * ---------------------------------------------------------
 * Upload Routes
 * ---------------------------------------------------------
 * Defines API endpoints related to file uploads.
 */

const express = require("express");
const { uploadFile } = require("../controllers/upload.controller");

const router = express.Router();

/**
 * POST /api/upload
 *
 * Handles CSV/JSON file uploads.
 */
router.post("/upload", uploadFile);

module.exports = router;