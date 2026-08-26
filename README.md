StreamWeaver is a modular ETL platform: upload → stream/process → store → serve, with a Node.js backend (ETL + API) and a Vite/React frontend.
Key features (user-facing)

Incremental, memory-efficient ETL for large CSV/JSON files (streaming design).
No-code / visual pipeline builder (source → transformation → destination).
Upload handlers with progress and validation (CSV / JSON support).
Frontend dashboard: login, datasets, pipelines, analytics, history and pipeline configuration UI.
Isolated execution for user-defined transformations (architecture includes isolated execution environment).
Batch database ingestion for performance (bulk write semantics expected for destinations such as MongoDB).

Backend entry & app setup

backend/src/app.js — Express app configuration: helmet, CORS (origin from env), JSON size limit, health check, route mounting and central error handler.
backend/server.js (and root server.js) — process bootstrap / HTTP listen wiring.
Authentication & middleware

backend/src/middleware/auth.js — JWT-based authenticate middleware referenced by routes (app mounts /api/etl with authenticate()).
backend/src/middleware/* — place for request validation, error handling, CORS, logging (error handler referenced by app.js).
API routes & controllers

backend/src/routes/* — API route definitions (etl, auth, pipelines in pipeline subproject).
backend/src/controllers/upload.controller.js — handles file upload requests and delegates to upload.service (returns filename and success payload).
backend/src/controllers/etl.controller.js — ETL route handler (current stub responds with success but used to trigger ETL flow).
ETL implementation (modular, single-responsibility)

backend/src/etl/index.js — ETL orchestration (extract → transform → load).
backend/src/etl/extract.js — extraction helpers (parsing / chunking).
backend/src/etl/transform.js — transformation rules and validation.
backend/src/etl/load.js — persistence / batch write helpers.
Pattern: small modules allow running ETL via API controllers or direct invocation for testing.
Upload & file handling

backend/src/services/upload.service (referenced by upload.controller.js) — handles receiving and saving uploads to configured uploadDir.
backend/.env.example — environment example for configuring uploadDir, PORT, clientOrigin, JWT secret, etc.
Frontend

frontend/src/main.jsx — app entry (Vite + React).
frontend/src/styles.css — base styling.
frontend/vite.config.js and frontend/package.json — dev tooling and scripts.
Frontend structure (components/pages): Login, Dashboard, UploadPage, PipelinesPage, AnalyticsPage, HistoryPage, SettingsPage (per branch README).
Optional/parallel pipeline project

"StreamWeaver API Pipeline/backend" — parallel/example pipeline code, with its own app.js, routes and ETL endpoints (shows modular approach for pipelines and pipelines router).
Notable endpoints (from code)

GET /health → health check (app.js)
/api/auth → authentication routes (authRouter)
/api/etl → ETL control and status routes (etlRouter) — mounted with authentication
/api/* upload and ETL routes (uploadRoutes and etlRoutes appear in one app.js variant)
Team contributions 

Akiti-Shravani (branch: Akiti-Shravani)

Frontend design & implementation: React UI, Login, Dashboard, Navbar, Sidebar, Dataset Upload UI, Pipeline Builder (source / transform / destination), CSV/JSON validation, upload progress, API integration.
Files referenced: frontend/src/*, public/, Vite config, reusable components and pages.
Siddhant (branch: Siddhant)

Backend structure and routes (backend/), ETL scaffolding, server wiring and integration work — backend folder exists in this branch with server and route code.
Nikhil (branch: Nikhil)

Project-level README and initial proposal content (README.md on Nikhil branch).
Database designing and testing API.

Consolidated backend code (controllers, etl modules, middleware, app.js), the StreamWeaver API Pipeline folder, and top-level package metadata.
Tech stack (concise)

Languages: JavaScript/Node.js (backend & frontend)
Backend: Express-style app, Node streams for incremental processing, modular ETL (extract/transform/load)
Frontend: React + Vite (client app, routing, Axios recommended for API)
Data store: MongoDB (document model and bulkWrite() use-case referenced)
Security/Execution: architecture references isolated execution (isolated-vm / sandboxing) for user transformations
Configuration (what to set)

Copy backend/.env.example → backend/.env and set:
PORT (server port)
CLIENT_ORIGIN (frontend origin for CORS)
UPLOAD_DIR (path to store uploaded files)
JWT secret / auth credentials for protected routes
Database connection string (MongoDB URI) if using persistence
Frontend: check env or main.jsx for API base URL and set to backend host/port

Author
Siddhi Patil - Backend + Team Lead (StremWeaver)
