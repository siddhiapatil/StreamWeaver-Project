# StreamWeaver

A memory-safe, no-code ETL platform for processing large CSV datasets. StreamWeaver streams uploads to disk, incrementally parses and transforms rows, executes user transformations in isolated environments, and efficiently writes results to MongoDB.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Safety & Performance](#safety--performance)
- [Team Workflow](#team-workflow)

## Architecture

```text
React Upload + Virtual Preview
         ↓
    Express/Busboy
         ↓
    FS Stream → CSV Parser → Transform Pipeline → Isolated VM
         ↓
   MongoDB BulkWrite
         ↓
   Socket.IO Progress Events
```

## Prerequisites

- **Node.js** 20 LTS (required; Node 24 prebuilt binaries for `isolated-vm` unavailable on Windows)
- **MongoDB** 7+
- **Python 3** and Visual Studio C++ build tools (Windows only, if `isolated-vm` prebuilt binary unavailable)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

> **Note:** `isolated-vm` is a native module. On Windows, if prebuilt binaries are unavailable, ensure Python 3 and Visual Studio C++ build tools are installed first.

### 2. Configure Environment

Copy `backend/.env.example` to `backend/.env` and set:

```env
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-long-random-secret>
```

### 3. Run Development Servers

Start the backend:

```bash
npm run dev --workspace=backend
```

In another terminal, start the frontend:

```bash
npm run dev --workspace=frontend
```

**URLs:**
- Frontend: `http://localhost:5173`
- API: `http://localhost:4000`

## API Documentation

### Authentication

#### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Data Analyst",
  "email": "analyst@example.com",
  "password": "strong-password"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "analyst@example.com",
  "password": "strong-password"
}
```

**Response:** Signed JWT token and safe user profile

> The React frontend includes a working manual test client for both endpoints.

## Safety & Performance

### Memory Efficiency

- Uploads are streamed directly to disk via Busboy; no full request body buffered in memory
- CSV parsing, mapping, validation, and batching use Node streams

### Transformation Security

- Custom transformations are expressions or functions that return a value
- Execution happens in isolated VM environments (no access to Node globals)
- **Timeout:** 50 ms per transformation

### Data Processing

- MongoDB `bulkWrite()` flushes every 1,000 rows
- Virtual preview capped at 1,000 records for performance (`react-virtualized`)

## Team Workflow

Organize team collaboration as follows:

1. **Branch Strategy:** Create one branch per active team member (`member-name`)
2. **Commits:** Make meaningful, atomic commits on your branch
3. **Integration:** Submit pull requests for code review before merging into `main`
4. **Activity:** Maintain regular team activity; the execution handbook requires 10 weeks of documented team contributions

---

**Built with:** React, Express, MongoDB, isolated-vm, Socket.IO
