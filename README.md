# StreamWeaver

## Project Description

**StreamWeaver** is a memory-safe, high-throughput no-code ETL (Extract, Transform, Load) platform designed for processing large CSV datasets efficiently. It enables users to upload massive CSV files without overwhelming server memory, apply custom transformations securely in isolated sandboxed environments, and batch-insert millions of rows into MongoDB with real-time progress tracking.

The platform is built for data engineers, analysts, and non-technical users who need to:
- Upload and stream large CSV files (up to 10GB) directly to disk
- Define field mappings and apply transformations to CSV data
- Execute custom transformation logic safely in isolated VM environments
- Bulk-insert transformed data into MongoDB with live progress updates
- Monitor ETL jobs via real-time WebSocket events

---

## How StreamWeaver Works

### Workflow Flowchart

```
┌──────────────────────────────────────────────────────────────────────┐
│                         USER AUTHENTICATION                           │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Frontend: Login/Register Form                                   │ │
│  │ • Email validation, minimum 8-char password                     │ │
│  │ • POST /api/auth/register or POST /api/auth/login               │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                 ↓                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Backend: JWT Token Generation                                   │ │
│  │ • bcryptjs password hashing & verification                      │ │
│  │ • Generate 8-hour expiring JWT token                            │ │
│  │ • Return token + user profile                                   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                 ↓                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Frontend: Store JWT in localStorage                             │ │
│  │ • Use for Authorization: Bearer <token> header                  │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                 ↓
┌──────────────────────────────────────────────────────────────────────┐
│                      CSV FILE UPLOAD (STREAMING)                      │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Frontend: User selects CSV file                                 │ │
│  │ • POST /api/etl/upload (multipart/form-data)                    │ │
│  │ • Requires JWT Bearer token in Authorization header             │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                 ↓                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Backend: Busboy Stream Handler                                  │ │
│  │ • Validate MIME type (text/csv) & .csv extension                │ │
│  │ • Generate unique UUID jobId                                    │ │
│  │ • Stream file to disk at uploads/{jobId}.csv                    │ │
│  │ • File size limit: 10 GB                                        │ │
│  │ • Return 202 Accepted with jobId                                │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                 ↓                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Frontend: Receive jobId                                         │ │
│  │ • User proceeds to transform step                               │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                 ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    ETL TRANSFORMATION & PROCESSING                    │
│                                                                        │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Frontend: Define Field Mappings                                 │ │
│  │ • Map source CSV columns to destination fields                  │ │
│  │ • Define transformation expressions (async JavaScript)          │ │
│  │ • POST /api/etl/:jobId/process with mappings array              │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                 ↓                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Backend: Validate Request                                       │ │
│  │ • Check file exists in uploadDir                                │ │
│  │ • Validate mappings (source + destination required)             │ │
│  │ • Path traversal protection                                     │ │
│  │ • Emit Socket.IO 'started' event on etl:{jobId}                 │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                 ↓                                      │
│  ┌──────── ETL PIPELINE (Node Streams) ──────────────────────────┐   │
│  │                                                                  │   │
│  │  1. CSV Parser (csv-parse)                                      │   │
│  │     └─ Read file stream, parse rows with headers                │   │
│  │                                                                  │   │
│  │  2. RowMapper (Transform stream)                                │   │
│  │     └─ For each row:                                            │   │
│  │        • Apply field mappings                                   │   │
│  │        • Call transformValue() for each mapping                 │   │
│  │        • Execute in isolated-vm sandbox                         │   │
│  │        • Emit progress every 100 rows                           │   │
│  │                                                                  │   │
│  │  3. BulkWriter (Writable stream)                                │   │
│  │     └─ Batch transformed rows (default 1000 per batch)          │   │
│  │        • On batch complete: collection.bulkWrite()              │   │
│  │        • Ordered: false (max throughput)                        │   │
│  │        • Create dynamic collection etl_{jobId}                  │   │
│  │        • Emit inserted count to Socket.IO                       │   │
│  │                                                                  │   │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                 ↓                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Isolated-VM Sandbox (Per Transformation)                        │ │
│  │ • Memory limit: 8 MB per context                                │ │
│  │ • Execution timeout: 50 ms                                      │ │
│  │ • No access to Node.js globals (require, process, etc)          │ │
│  │ • Provides: value (current field), row (full row data)          │ │
│  │ • Returns: transformed result via copyInto()                    │ │
│  │ • Disposes context immediately to prevent leaks                 │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                 ↓                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ MongoDB Bulk Insert                                             │ │
│  │ • Dynamic collection: etl_{jobId} (hyphens removed)             │ │
│  │ • insertOne operation per document                              │ │
│  │ • Batch size: 1000 rows (configurable)                          │ │
│  │ • All-or-nothing semantics per batch                            │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                 ↓                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Backend: Stream Completion                                      │ │
│  │ • Return { jobId, processed, inserted }                         │ │
│  │ • Emit Socket.IO 'complete' event with counts                   │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                 ↓                                      │
│  ┌─────────────────────────────────────────────────────────────────┐ │
│  │ Frontend: Display Results                                       │ │
│  │ • Show transformation progress in real-time                     │ │
│  │ • Display final counts: processed & inserted rows               │ │
│  │ • Virtual preview table updated with sample data                │ │
│  └─────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
                                 ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    REAL-TIME PROGRESS (WebSocket)                     │
│                                                                        │
│  Socket.IO named channel: etl:{jobId}                                 │
│  Events:                                                              │
│  • { status: 'started' } - Processing initiated                       │
│  • { processed: N, inserted: M } - Progress updates                   │
│  • { status: 'complete', processed: N, inserted: M } - Final result   │
│                                                                        │
│  Frontend subscribes to socket.on('etl:{jobId}', ...)                 │
│  for live progress tracking                                           │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Features

### ✅ Core Capabilities

- **Memory-Efficient Streaming**
  - CSV files streamed directly to disk via Busboy
  - No full request body buffered in memory
  - Supports files up to 10 GB

- **JWT-Based Authentication**
  - Email/password registration with validation
  - 8-hour expiring JWT tokens
  - Bearer token authentication on protected routes
  - Secure password hashing with bcryptjs

- **Field Mapping & Transformation**
  - Map source CSV columns to destination MongoDB fields
  - Define custom async JavaScript transformation expressions
  - Access full row data within transformations
  - Error handling per row (graceful degradation)

- **Sandboxed Code Execution**
  - Isolated-vm environment with 8 MB memory limit
  - 50 ms execution timeout per transformation
  - No access to Node.js globals or filesystem
  - Protection against malicious code

- **High-Throughput Database Operations**
  - MongoDB bulk inserts in batches of 1,000 rows
  - Unordered writes for maximum speed
  - Dynamic collection per job (etl_{jobId})
  - All-or-nothing batch semantics

- **Real-Time Progress Tracking**
  - Socket.IO WebSocket broadcasting
  - Named channels per job (etl:{jobId})
  - Live processing & insertion counts
  - Status events (started, complete)

- **Virtualized UI Preview**
  - React-virtualized table (1,000 rows)
  - Only visible rows rendered to DOM
  - Minimal memory footprint
  - Responsive and performant

### 🔒 Security Features

- **Path Traversal Protection**: File access confined to uploadDir
- **MIME Type Validation**: Only accepts text/csv files
- **Input Validation**: Email format, password length, CSV extension
- **Rate Limiting Ready**: Helmet security headers enabled
- **CORS Protection**: Origin validation via environment config
- **JSON Size Limiting**: 64 KB JSON request limit

---

## Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Vite** - Modern bundler with hot module replacement
- **React-Virtualized** - Virtual rendering for large lists
- **Socket.IO Client** - Real-time WebSocket communication

### Backend
- **Node.js 20 LTS** - JavaScript runtime
- **Express.js** - Web framework with middleware support
- **Socket.IO** - WebSocket server for real-time events
- **Busboy** - Streaming multipart/form-data parser
- **csv-parse** - Incremental CSV parser
- **Mongoose** - MongoDB object modeling
- **isolated-vm** - Sandboxed JavaScript VM
- **bcryptjs** - Password hashing with salt
- **jsonwebtoken** - JWT token generation & verification
- **Helmet** - Security headers middleware
- **CORS** - Cross-origin resource sharing

### Database
- **MongoDB 7+** - NoSQL document database
  - Dynamic collections per ETL job
  - Bulk write operations for efficiency

### Development Tools
- **dotenv** - Environment variable management
- **crypto (Node.js built-in)** - UUID generation for jobIds

---

## Prerequisites

Before running StreamWeaver, ensure you have:

- **Node.js** 20 LTS (required; Node 24 missing `isolated-vm` prebuilt on Windows)
- **MongoDB** 7+ (local or cloud instance)
- **npm** 10+ (Node package manager)
- **Python 3** & Visual Studio C++ build tools (Windows only, for native module compilation)

---

## Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/siddhiapatil/StreamWeaver-Project.git
cd StreamWeaver-Project
```

### Step 2: Install Dependencies

Install all dependencies for both backend and frontend workspaces:

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your configuration:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/streamweaver
JWT_SECRET=your-long-random-secret-key-here-min-32-chars
CLIENT_ORIGIN=http://localhost:5173
UPLOAD_DIR=uploads
```

**Environment Variables Explained:**
- `PORT`: Backend server port (default: 4000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing (required, throws error if missing)
- `CLIENT_ORIGIN`: Frontend URL for CORS validation
- `UPLOAD_DIR`: Directory for CSV file uploads (created if doesn't exist)

### Step 4: Start MongoDB

Ensure MongoDB is running (local or cloud):

```bash
# Local MongoDB (if installed)
mongod
```

Or use MongoDB Atlas for cloud deployment.

### Step 5: Start Development Servers

**Terminal 1 - Start Backend:**

```bash
npm run dev --workspace=backend
```

Expected output:
```
StreamWeaver API listening on :4000
```

**Terminal 2 - Start Frontend:**

```bash
npm run dev --workspace=frontend
```

Expected output:
```
Local: http://localhost:5173
```

### Step 6: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **API Health Check**: http://localhost:4000/health

---

## Running Tests

Run the test suite:

```bash
npm run test --workspace=backend
```

---

## API Endpoints

### Authentication Routes (Public)

#### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (201):
{
  "token": "eyJhbGc...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}

Response (200):
{
  "token": "eyJhbGc...",
  "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
}
```

### ETL Routes (Protected - Requires JWT Bearer Token)

#### Upload CSV File
```bash
POST /api/etl/upload
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

file: <csv-file>

Response (202):
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "file": "/absolute/path/to/uploads/550e8400-e29b-41d4-a716-446655440000.csv"
}
```

#### Process & Transform
```bash
POST /api/etl/:jobId/process
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "mappings": [
    {
      "source": "firstName",
      "destination": "first_name",
      "transform": "async (value) => value.toUpperCase()"
    },
    {
      "source": "age",
      "destination": "age_group",
      "transform": "async (value) => value < 18 ? 'minor' : 'adult'"
    }
  ]
}

Response (200):
{
  "jobId": "550e8400-e29b-41d4-a716-446655440000",
  "processed": 10000,
  "inserted": 10000
}
```

---

## Project Structure

```
StreamWeaver/
├── backend/
│   ├── src/
│   │   ├── server.js                 # Entry point, MongoDB + Socket.IO setup
│   │   ├── app.js                    # Express app configuration
│   │   ├── config/
│   │   │   └── env.js                # Environment variables validation
│   │   ├── middleware/
│   │   │   └── auth.js               # JWT Bearer token verification
│   │   ├── models/
│   │   │   └── User.js               # Mongoose User schema
│   │   ├── routes/
│   │   │   ├── auth.js               # /register, /login endpoints
│   │   │   └── etl.js                # /upload, /:jobId/process endpoints
│   │   └── services/
│   │       ├── etlPipeline.js        # RowMapper, BulkWriter, processCsv
│   │       └── sandbox.js            # isolated-vm transformation execution
│   ├── .env.example                  # Environment variables template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx                  # React entry point (Login + Preview)
│   │   └── styles.css                # UI styling
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── package.json                      # Monorepo workspace config
└── README.md
```

---

## Usage Example

### Complete Workflow

1. **Register User**
   ```bash
   curl -X POST http://localhost:4000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'
   ```

2. **Login & Get Token**
   ```bash
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@example.com","password":"password123"}'
   # Response includes: { "token": "eyJhbGc...", "user": {...} }
   ```

3. **Upload CSV File**
   ```bash
   curl -X POST http://localhost:4000/api/etl/upload \
     -H "Authorization: Bearer <your-jwt-token>" \
     -F "file=@data.csv"
   # Response: { "jobId": "550e8400-...", "file": "/path/to/file.csv" }
   ```

4. **Process & Transform**
   ```bash
   curl -X POST http://localhost:4000/api/etl/550e8400-/process \
     -H "Authorization: Bearer <your-jwt-token>" \
     -H "Content-Type: application/json" \
     -d '{
       "mappings": [
         {"source":"col1","destination":"column_1"},
         {"source":"col2","destination":"column_2"}
       ]
     }'
   # Response: { "jobId": "550e8400-...", "processed": 5000, "inserted": 5000 }
   ```

5. **Monitor Progress (WebSocket)**
   ```javascript
   // Frontend code
   import io from 'socket.io-client';
   const socket = io('http://localhost:4000');
   socket.on('etl:550e8400-...', (message) => {
     console.log(message); // { status: 'started' } or { processed: 100, inserted: 100 } etc
   });
   ```

---

## Deployment

### Production Build

```bash
# Build frontend
npm run build --workspace=frontend

# Run backend in production
npm run start --workspace=backend
```

### Environment Configuration
Set environment variables in your hosting platform (Heroku, AWS, etc.):
- `MONGODB_URI` - Production MongoDB URI
- `JWT_SECRET` - Strong random secret (32+ characters)
- `CLIENT_ORIGIN` - Production frontend URL
- `PORT` - Server port (default: 4000)

---

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running
- Verify `MONGODB_URI` in `.env` matches your setup
- Check MongoDB network access if using Atlas

### isolated-vm Build Issues (Windows)
- Install Python 3 from python.org
- Install Visual Studio C++ build tools
- Run: `npm install --build-from-source`

### JWT Token Expired
- Tokens expire in 8 hours
- Users must login again to get a new token

### File Upload Size Limit
- Default limit is 10 GB via Busboy
- Modify `fileSize` in `backend/src/routes/etl.js` if needed

---

## Performance & Scalability

- **Memory**: Streaming architecture prevents memory bloat even with multi-gigabyte files
- **Throughput**: Bulk inserts handle 1,000+ rows/second
- **Concurrency**: Multiple simultaneous uploads via jobId-based isolation
- **Transformation**: 50ms timeout prevents long-running code
- **Database**: Dynamic collections per job allow parallel processing

---

## Security Best Practices

1. ✅ Use strong JWT_SECRET (32+ random characters)
2. ✅ Enable HTTPS in production
3. ✅ Validate file uploads (MIME type + extension)
4. ✅ Use CORS for trusted origins only
5. ✅ Regularly update Node.js and dependencies
6. ✅ Monitor isolated-vm resource limits
7. ✅ Hash passwords with bcryptjs (done automatically)

---

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request with description

---

## License

This project is open source under the MIT License.

---

**Author:** Siddhi Patil - Backend Developer (StreamWeaver)
