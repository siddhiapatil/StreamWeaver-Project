# StreamWeaver project flow

## Week 1 + Week 2
1. JWT authentication protects backend APIs.
2. CSV uploads are streamed to disk using Busboy.
3. Pipeline configurations store Source (`csv-upload`), Transformation mappings, and Destination (`mongodb`).
4. CSV rows are processed as streams and optional transforms run in the `isolated-vm` sandbox.
5. Transformed rows are loaded to MongoDB in batches (default 1,000).

## Week 3 – Pipeline execution
1. Upload a CSV and receive a `sourceJobId`.
2. Call `POST /api/pipelines/:pipelineId/run` with that `sourceJobId`.
3. Backend creates a `PipelineRun` and returns HTTP `202` with `RUNNING`.
4. Executor links **Source → Transformation → Destination**.
5. Progress is emitted on `pipeline-run:<runId>` and persisted in the run document.
6. Execution finishes as `SUCCESS` or `FAILED` with a standardized error object.
7. `GET /api/pipelines/:pipelineId/runs/:runId` returns current/final execution state.
8. Structured JSON logs are written to `logs/pipeline-runs.log`.

## High-throughput boundary
The Week 3 path is streaming and batch based and enforces a 60,000-row run limit, avoiding loading all rows into memory simultaneously.
