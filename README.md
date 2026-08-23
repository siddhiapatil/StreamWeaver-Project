StreamWeaver:ETL Engine & API Pipeline is a high-throughput, memory-safe backend engine and secure API platform engineered for complex ETL (Extract, Transform, Load) pipelines. Built with Node.js stream processing and a sandboxed execution environment, it handles dynamic transformation rules, dataset file uploads, and pipeline orchestration with strict JWT authentication, role-based pipeline management, and isolated JS script execution.

🏗️ Core Architecture & Pipeline FlowPlaintext



                      ┌────────────────────────┐
                      │   Client / Frontend    │
                      └───────────┬────────────┘
                                  │ REST API (Bearer JWT)
┌─────────────────────────────────────────────────────────────────────────┐
│                           StreamWeaver Engine                           │
│                                                                         │
│  ┌─────────────────┐     ┌──────────────────────┐     ┌──────────────┐  │
│  │ JWT Middleware  │ ──► │ Dynamic Pipeline     │ ──► │  Sandbox     │  │
│  │ & Input Validation │  │ Orchestrator         │     │  Execution   │  │
│  └─────────────────┘     └──────────────────────┘     └──────────────┘  │
│                                     │                                   │
│                                     ▼                                   │
│  ┌─────────────────┐     ┌──────────────────────┐     ┌──────────────┐  │
│  │ Extract (CSV)   │ ──► │ Transform Engine     │ ──► │ Load Writer  │  │
│  │ Stream Reader   │     │ (Custom Rules/Code)  │     │ (JSON/DB)    │  │
│  └─────────────────┘     └──────────────────────┘     └──────────────┘  │
└─────────────────────────────────────┬───────────────────────────────────┘
                                      │
                                      ▼
                      ┌────────────────────────┐
                      | MongoDB / Local Disk   |
                        ───────────────────────


[1] Authentication & Validation Layer (/middleware/auth.js, /utils/validation.js): Intercepts requests using JSON Web Tokens (JWT) and validates incoming pipeline configurations against schemas prior to execution.

[2] Dynamic Pipeline Orchestrator (/services/etlPipeline.js): Manages end-to-end pipeline creation, updates, persistent Mongo models, and execution lifecycle.

[3] Sandboxed Transformation Sandbox (/services/sandbox.js): Safely evaluates user-defined custom code snippets and complex row-level transformations within an isolated Node.js execution sandbox

[4] Stream Extract, Transform & Load (/etl/extract.js, /etl/transform.js, /etl/load.js): Processes large datasets chunk-by-chunk using non-blocking file streams to ensure zero V8 heap crashes during heavy file transformations.

🔑 Key Features & Technical Highlights
🔐 Secure User Authentication & Pipeline Control: Complete JWT-based auth flow (/routes/auth.js) backed by encrypted user credentials in MongoDB.

🧪 Isolated JavaScript Sandbox: Securely run dynamic custom transformation scripts on incoming data records without risking server process compromise (/services/sandbox.js).

⚡ High-Throughput Streaming Engine: Memory-safe stream processing pipelines for massive dataset handling (/services/etl.service.js).

🛡️ Robust Validation & Error Handling: Centralized custom AppError class and input validation middleware to catch failed stages gracefully (/utils/AppError.js).

🧪 End-to-End Integration Testing: Integration test suites written for pipeline controllers and validation rules (/test/pipelines.integration.test.js).


StreamWeaver-Project/
├── package.json
├── README.md
├── docs/
│   └── PROJECT_FLOW.md
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       └── styles.css
└── StreamWeaver API Pipeline/
    └── backend/
        ├── server.js
        ├── package.json
        ├── src/
        │   ├── app.js
        │   ├── config/
        │   │   └── env.js
        │   ├── middleware/
        │   │   └── auth.js
        │   ├── models/
        │   │   ├── Pipeline.js
        │   │   └── User.js
        │   ├── routes/
        │   │   ├── auth.js
        │   │   ├── etl.js
        │   │   └── pipelines.js
        │   ├── services/
        │   │   ├── etlPipeline.js
        │   │   └── sandbox.js
        │   └── utils/
        │       ├── AppError.js
        │       └── validation.js
        └── test/
            ├── pipelines.integration.test.js
            └── validation.test.js



🚀 Setup & Execution
Prerequisites
Node.js (v18 or higher)

MongoDB instance (Local or Atlas MongoDB URI)

npm 


Clone the repository:

Bash
git clone https://github.com/SiddhiPatil/StreamWeaver-Project.git
cd StreamWeaver-Project
Configure Environment Variables:
Create a .env file in StreamWeaver API Pipeline/backend/:

Code 
PORT=5000
MONGODB_URI=mongodb://localhost:27017/streamweaver
JWT_SECRET=your_jwt_secret_key
Install Dependencies:

Bash
# Install backend dependencies
cd "StreamWeaver API Pipeline/backend"
npm install

# Install frontend dependencies
cd ../../frontend
npm install
Start Application:

Bash
# Start Backend API Server
cd "../StreamWeaver API Pipeline/backend"
npm run dev

# Start Frontend UI
cd ../../frontend
npm run dev


👩‍💻 Author
Siddhi Patil
Backend Developer — StreamWeaver Platform






                        






                      
                      
