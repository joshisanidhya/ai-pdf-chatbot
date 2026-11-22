# Deployment

Use Node 22+, a private durable filesystem for both `UPLOAD_DIR` and `VECTOR_INDEX_DIR`, and MongoDB with backups. Copy `backend/.env.example` and set a unique strong `JWT_SECRET`, `MONGODB_URI`, `FRONTEND_URL`, and LLM provider credentials. Run `npm ci` in each package, then `npm start` in `backend/` and `npm run build` in `frontend/`. Never place uploaded PDFs or vector snapshots in a public static directory.

The backend does not yet have durable background ingestion, migrations, account deletion, or proven multi-replica index coherence. Deploy one backend instance until those are addressed. Set `OTEL_ENABLED=true` and `OTEL_EXPORTER_OTLP_ENDPOINT` only when a collector exists. Set `PERSIST_VECTOR_INDEX=false` to roll back snapshot reads/writes; legacy PDF reprocessing then resumes. No production deployment was performed in this work.
