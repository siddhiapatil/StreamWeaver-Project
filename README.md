# StreamWeaver

Memory-safe, no-code ETL for large CSV datasets. The platform streams uploads to disk, parses and transforms rows incrementally, executes approved user transformations in an isolate, and writes documents to MongoDB in efficient batches.

## Architecture

```text
React upload + virtual preview -> Express/Busboy -> fs stream -> CSV parser
                                                       -> Transform pipeline -> isolated-vm
                                                       -> MongoDB bulkWrite
                                                       -> Socket.IO progress events
```

## Start locally

1. Install Node.js **20 LTS** and MongoDB 7+. `isolated-vm` currently needs Node 20 on Windows (Node 24 does not provide the required prebuilt binary in this environment).
2. Copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI` and a long `JWT_SECRET`.
3. Run `npm install` from this directory. `isolated-vm` is native; on Windows, if a prebuilt binary is unavailable, install Python 3 and the Visual Studio C++ build tools first. The API fails closed when the sandbox runtime is unavailable.
4. Run `npm run dev --workspace=backend` and `npm run dev --workspace=frontend` in another terminal.

The frontend opens at `http://localhost:5173`; the API listens on `http://localhost:4000`.

## Login API

`POST /api/auth/register`

```json
{"name":"Data Analyst","email":"analyst@example.com","password":"strong-password"}
```

`POST /api/auth/login` accepts `email` and `password`, and returns a signed JWT and safe user profile. The React screen is a working manual test client for both endpoints.

## ETL safety and performance

- Uploads are written with Busboy directly to `uploads/`; no full request body is loaded into memory.
- CSV parsing, mapping, validation, and batching use Node streams.
- Custom transformations must be expressions or functions that return a value. They run without Node globals and have a 50 ms execution timeout.
- Every 1,000 rows is flushed using MongoDB `bulkWrite()`.
- The preview is capped at 1,000 records and rendered with `react-virtualized`.

## Repository workflow

For a team, create one branch per active member (`member-name`), commit meaningful work in that branch, and merge reviewed changes into `main`. The execution handbook requires team activity on 10 of the preceding 14 days for mid-review and each of the preceding 20 days for final review.
