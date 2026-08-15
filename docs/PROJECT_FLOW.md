# StreamWeaver project flow

1. A user registers or logs in. The API hashes passwords using bcrypt and returns a time-limited JWT.
2. The React client sends the CSV as multipart data. Busboy pipes it to disk, which avoids buffering the file in Express memory.
3. The client posts column mappings such as `first_name -> firstName` and optional transform functions such as `value => String(value).trim().toUpperCase()`.
4. `csv-parse` emits one record at a time. A Node `Transform` maps each row and runs each custom transform in an 8 MB `isolated-vm` isolate with a 50 ms timeout.
5. A writable stream buffers transformed records. It calls MongoDB `bulkWrite()` for each 1,000-record batch.
6. Socket.IO broadcasts `started`, `processed`, `inserted`, and `complete` messages on `etl:<jobId>` so the React progress UI can update without polling.

## Current delivery boundary

This starter delivers authentication, the protected streaming ETL API, a virtualized React preview, and the processing primitives. The next UI increment is the mapping/upload/progress screen, connected to the supplied ETL endpoints.
