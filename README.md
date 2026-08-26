# StreamWeaver

A memory-safe, high-throughput no-code ETL platform for processing large CSV datasets. StreamWeaver streams file uploads directly to disk, incrementally parses and transforms rows using isolated sandboxed execution, and bulk-inserts processed data into MongoDB.

## Project Description

StreamWeaver is an ETL (Extract, Transform, Load) platform that enables users to:
- Upload and stream large CSV files (up to 10GB) directly to disk without buffering in memory
- Define field mappings and apply custom transformations to CSV data
- Execute transformation logic safely in isolated VM environments (8MB memory, 50ms timeout)
- Bulk-insert transformed data into MongoDB with live progress tracking via WebSocket

## Workflow

```
User Login (JWT Auth)
        ↓
Upload CSV File (Busboy Streaming)
        ↓
Define Field Mappings & Transformations
        ↓
Process Pipeline:
  • CSV Parser → RowMapper → Isolated-VM Sandbox → BulkWriter → MongoDB
        ↓
Real-time Progress (WebSocket etl:{jobId})
        ↓
View Results (processed & inserted counts)
```

## Features

- **Streaming Upload**: CSV files streamed to disk via Busboy (10GB limit), not buffered in memory
- **JWT Authentication**: Email/password login with bcryptjs hashing and 8-hour JWT tokens
- **Field Mapping**: Map source CSV columns to destination MongoDB fields
- **Isolated Transformations**: Custom async JavaScript code runs in isolated-vm (8MB memory, 50ms timeout, no Node globals)
- **Batch Database Writes**: MongoDB bulk inserts in batches of 1,000 rows with unordered writes for speed
- **Real-time Progress**: Socket.IO broadcasts progress on `etl:{jobId}` channel
- **Virtual Preview**: React-virtualized table renders 1,000 sample rows efficiently
- **Security**: Path traversal protection, MIME type validation, input validation, password hashing

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 18, Vite, React-Virtualized, Socket.IO Client |
| Backend | Node.js 20 LTS, Express.js, Socket.IO, Busboy, csv-parse |
| Database | MongoDB 7+ |
| Security | isolated-vm, bcryptjs, JWT |
| Tools | Helmet, CORS, dotenv, crypto |

## Prerequisites

- Node.js 20 LTS
- MongoDB 7+
- Python 3 & Visual Studio C++ build tools (Windows only, for isolated-vm)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `backend/.env`:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/streamweaver
JWT_SECRET=your-secret-key-here
CLIENT_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
```

### 3. Run Development Servers

Backend:
```bash
npm run dev --workspace=backend
```

Frontend (separate terminal):
```bash
npm run dev --workspace=frontend
```

**URLs:**
- Frontend: http://localhost:5173
- API: http://localhost:4000

## API Endpoints

### Authentication (Public)

**POST /api/auth/register**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**POST /api/auth/login**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### ETL (Protected - Requires JWT Bearer Token)

**POST /api/etl/upload**
- Upload CSV file (multipart/form-data)
- Returns: `{ jobId, file }`

**POST /api/etl/:jobId/process**
```json
{
  "mappings": [
    {
      "source": "firstName",
      "destination": "first_name",
      "transform": "async (value) => value.toUpperCase()"
    }
  ]
}
```
- Returns: `{ jobId, processed, inserted }`

## Project Structure

```
StreamWeaver/
├── backend/
│   ├── src/
│   │   ├── server.js              # Entry point
│   │   ├── app.js                 # Express configuration
│   │   ├── config/env.js          # Environment variables
│   │   ├── middleware/auth.js     # JWT verification
│   │   ├── models/User.js         # User schema
│   │   ├── routes/
│   │   │   ├── auth.js            # Register/Login endpoints
│   │   │   └── etl.js             # Upload/Process endpoints
│   │   └── services/
│   │       ├── etlPipeline.js     # RowMapper, BulkWriter, processCsv
│   │       └── sandbox.js         # isolated-vm execution
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx               # React components (Login, Preview)
│   │   └── styles.css
│   ├── index.html
│   └── package.json
│
└── package.json (monorepo config)
```

## How It Works

1. **User registers/logs in** → JWT token issued
2. **User uploads CSV** → Busboy streams file to disk, returns jobId
3. **User defines mappings** → POST to /:jobId/process
4. **Backend processes**:
   - Opens CSV as stream
   - RowMapper applies mappings & transformations (via isolated-vm)
   - BulkWriter batches 1,000 rows and inserts to MongoDB collection `etl_{jobId}`
   - Socket.IO emits progress on `etl:{jobId}` channel
5. **Frontend displays** → Real-time progress + final counts

## WebSocket Events

Subscribe to `etl:{jobId}` channel:
```javascript
socket.on('etl:{jobId}', (message) => {
  // { status: 'started' }
  // { processed: N, inserted: M }
  // { status: 'complete', processed: N, inserted: M }
});
```

Author
Siddhi Patil - Backend (StremWeaver)
