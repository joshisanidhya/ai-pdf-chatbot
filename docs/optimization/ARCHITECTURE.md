# SAGE current and target architecture

## Current verified design

React/Vite browser → Express API → MongoDB for users/documents/conversations. PDF bytes are stored on the backend filesystem under per-user directories. Upload parsing uses `pdf-parse`; text is chunked by LangChain's recursive splitter; `@xenova/transformers` loads one shared all-MiniLM-L6-v2 pipeline per Node process and embeds each chunk sequentially. LangChain `MemoryVectorStore` is process-local. Retrieval embeds the question, uses in-memory similarity search, and sends context/history to OpenRouter/OpenAI/Ollama through Axios. The frontend receives a complete JSON answer; there is no streaming.

## Current limitations

- Restart invalidates all vector stores; the first query reparses and re-embeds the source PDF.
- Text extraction and chunk metadata do not preserve page boundaries, so persisted citation `pageNumber` is normally null.
- Upload processing is synchronous from the client's perspective.
- Local vectors consume process RAM and are not shared across replicas.
- Conversation messages and source text are embedded in one ever-growing Mongo document.
- Filesystem uploads require persistent, private storage on the backend host; ephemeral/serverless deployments can lose them.

## Target direction (not yet implemented)

Keep a simple modular monolith for initial users. Make a durable private document store and an owner-scoped chunk/embedding store explicit. Benchmark exact cosine search on expected document collections before selecting an index. Reuse one model instance and batch embeddings at a bounded size. Execute ingestion through a bounded worker with idempotent status transitions and safe retry. Keep LLM provider behind the current small adapter, record provider usage and timing, apply token/timeout/user-budget limits, and never share private-answer caches across tenants. Preserve user/document filters at every retrieval and file access boundary.

No separate vector database, microservice, OCR service, or Kubernetes deployment is justified by current evidence. Durable vector representation and worker lifecycle require a separate design/migration decision based on the baseline and target host's volume guarantees.

Tracing is optional. Set `OTEL_ENABLED=true` and `OTEL_EXPORTER_OTLP_ENDPOINT` to start the OpenTelemetry SDK; ordinary local and small deployments skip its startup and exporter overhead. The Express server closes HTTP connections and then shuts down tracing on SIGTERM.
