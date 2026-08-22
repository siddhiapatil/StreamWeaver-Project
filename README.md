# 🌊 StreamWeaver: High-Throughput No-Code ETL Pipeline

![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)
![Express.js](https://img.shields.io/badge/Express.js-5.x-blue.svg)
![Architecture](https://img.shields.io/badge/Architecture-Stream--Based-orange.svg)
![Status](https://img.shields.io/badge/Status-Mid--Project%20Review%20Ready-brightgreen.svg)
![License](https://img.shields.io/badge/License-ISC-brightgreen.svg)

StreamWeaver is a high-performance, memory-safe backend engine designed to process massive datasets (CSV/JSON) using Node.js file streams. It prevents Node.js V8 Heap Out-Of-Memory (OOM) crashes by streaming, parsing, transforming, and loading records chunk-by-chunk rather than loading entire datasets into memory at once.

---

## 🏗️ Architecture & Pipeline Flow

                  ┌────────────────────────┐
                  │   Client / Postman     │
                  └───────────┬────────────┘
                              │ POST /api/etl/process
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      StreamWeaver Engine                    │
│                                                             │
│   ┌───────────────┐     ┌────────────────┐     ┌─────────┐  │
│   │ Extract (CSV) │ ──► │ Transform (Row)│ ──► │  Load   │  │
│   │ createRead-   │     │ CSVToJSON-     │     │ (JSON   │  │
│   │ Stream        │     │ Transform      │     │ Writer) │  │
│   └───────────────┘     └────────────────┘     └─────────┘  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
                  ┌────────────────────────┐
                  │ backend/uploads/*.json │
                  └────────────────────────┘

1. **Extract Stage (`/backend/src/etl/extract.js`):**
   - Non-blocking sequential stream reader powered by `fs.createReadStream`.
   - Validates file existence and source format defensively before streaming.

2. **Transform Stage (`/backend/src/etl/transform.js`):**
   - Custom `CSVToJSONTransform` extending `stream.Transform` in `readableObjectMode: true`.
   - Robust line fragment and edge-case parsing: sanitizes Windows (`\r\n`) and Unix (`\n`) newlines, ignores trailing blank rows, and handles missing/uneven columns.
   - Dual Transformation Engine: Supports case-insensitive text formatting (uppercase fields) and condition-based row filtering (`min`, `equals`).

3. **Load Stage (`/backend/src/etl/load.js`):**
   - Non-blocking destination write stream that serializes and writes formatted JSON records directly to disk.

4. **Stream Upload Engine (`/backend/src/services/upload.service.js`):**
   - High-throughput multipart upload streaming using `busboy`, piping file chunks directly to disk without memory buffering.

5. **Unified ETL Orchestrator (`/backend/src/services/etl.service.js`):**
   - Coordinates end-to-end execution, tracks execution duration in milliseconds, logs progress per stage, and implements stage-aware error handling.

---

## 📁 Project Directory Structure

StreamWeaver/
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── backend/
├── server.js
├── src/
│   ├── app.js
│   ├── config/
│   │   └── constants.js
│   ├── controllers/
│   │   ├── etl.controller.js
│   │   └── upload.controller.js
│   ├── etl/
│   │   ├── extract.js
│   │   ├── index.js
│   │   ├── load.js
│   │   └── transform.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── etl.routes.js
│   │   └── upload.routes.js
│   ├── services/
│   │   ├── etl.service.js
│   │   └── upload.service.js
│   └── utils/
│       └── csvParser.js
└── uploads/
├── etl-test.csv
├── large-test.csv
└── test.csv


---

## 🚀 Setup & Execution

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Siddhant0570/StreamWeaver-Project.git](https://github.com/Siddhant0570/StreamWeaver-Project.git)
   cd StreamWeaver-Project

Install dependencies:

Bash
npm install
Start the development server:

Bash
npm run dev
The server will start listening at http://localhost:5000.

📡 API Reference & Verification

1. Server Health Check
Method: GET /

Response (200 OK):

JSON
{
  "success": true,
  "message": "StreamWeaver Backend is running"
}

2. Stream File Upload
Method: POST /api/upload

Content-Type: multipart/form-data

Body: file: <binary_csv_file>

Response (200 OK):

JSON
{
  "success": true,
  "message": "File uploaded successfully",
  "file": {
    "filename": "etl-test.csv",
    "path": "uploads/etl-test.csv"
  }
}

3. Run Full ETL Pipeline
Method: POST /api/etl/process

Content-Type: application/json

Request Body:

JSON
{
  "source": {
    "type": "csv",
    "path": "uploads/etl-test.csv"
  },
  "transformation": {
    "uppercaseFields": ["firstName", "city"],
    "filter": {
      "field": "age",
      "min": 21
    }
  },
  "destination": {
    "type": "json",
    "path": "uploads/output-hardened.json"
  }
}
Success Response (200 OK):

JSON
{
  "success": true,
  "message": "ETL Pipeline executed successfully",
  "data": {
    "status": "Success",
    "failedStage": null,
    "error": null,
    "executionTimeMs": 14,
    "recordsProcessed": 4,
    "source": {
      "type": "csv",
      "path": "uploads/etl-test.csv"
    },
    "appliedTransformations": {
      "uppercaseFields": [
        "firstName",
        "city"
      ],
      "filter": {
        "field": "age",
        "min": 21
      }
    },
    "destination": {
      "success": true,
      "destinationType": "json",
      "outputPath": "uploads/output-hardened.json",
      "recordsCount": 4
    },
    "logs": [
      "[2026-08-22T08:15:20.100Z] Pipeline execution initiated.",
      "[2026-08-22T08:15:20.102Z] Starting Extract stage for file: uploads/etl-test.csv",
      "[2026-08-22T08:15:20.106Z] Extract stage completed successfully.",
      "[2026-08-22T08:15:20.107Z] Starting Transform stage with rules: {\"uppercaseFields\":[\"firstName\",\"city\"],\"filter\":{\"field\":\"age\",\"min\":\"21\"}}",
      "[2026-08-22T08:15:20.111Z] Transform stage completed. Total records transformed: 4",
      "[2026-08-22T08:15:20.112Z] Starting Load stage to destination: uploads/output-hardened.json",
      "[2026-08-22T08:15:20.114Z] Load stage completed successfully.",
      "[2026-08-22T08:15:20.114Z] Pipeline completed in 14ms."
    ]
  }
}

🛡️ Error Handling Specifications
If an ETL stage fails (e.g., file not found or invalid format), the pipeline catches the error without crashing the server and returns a standardized 422 Unprocessable Entity response identifying the exact failed stage:

JSON
{
  "success": false,
  "message": "ETL Pipeline failed during 'Extract' stage",
  "data": {
    "status": "Failed",
    "failedStage": "Extract",
    "error": "[Extract Stage] Source file not found at path: uploads/non-existent.csv",
    "recordsProcessed": 0,
    "source": {
      "type": "csv",
      "path": "uploads/non-existent.csv"
    },
    "destination": null
  }
}

⚡ Performance Benchmarks
High Volume Dataset: large-test.csv (14,837 rows).

Execution Duration: ~246ms (throughput of ~60,000+ rows/second).

Memory Safety: Constant, bounded RAM usage using stream piping and chunk flushing.


📅 Roadmap & Milestones
[✅] Week 1 (Backend Core): Express Server, Constants, Error Handling & Busboy Streaming Upload.

[✅] Week 2 (Extract & Transform): Stream Extract Engine, CSV Parser & CSV-to-JSON Transformer.

[✅] Week 3 (Load & Orchestration): Destination Load Writer, Pipeline Orchestration, Filtering Rules, Edge-case Hardening & Benchmarks.


👨‍💻 Author
Siddhant Tambe

Backend Developer — StreamWeaver