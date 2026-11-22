# SAGE prioritized optimization roadmap

Status date: 2026-11-22. This roadmap is based on static repository inspection; performance priorities should be revisited after the baseline is measured.

## P0 — correctness, privacy, reliability

1. Stop public static serving of uploaded PDFs; require owner authorization for file access.
2. Validate PDF signatures, enforce size and parser resource bounds, return sanitized production errors.
3. Require a strong JWT secret in production and validate startup configuration.
4. Remove prompt/document content from logs; treat retrieved PDF content as untrusted evidence outside system policy.
5. Prevent duplicate vector restores and make lost/non-ready index states explicit.
6. Define document/account deletion and conversation retention behavior; clean up associated records safely.

## P1 — latency and cost

1. Measure extract/chunk/embed/index/retrieval separately on representative PDFs.
2. Persist vectors/chunks durably under an owner/document boundary; benchmark Mongo binary/vector payload or compact SQLite/local exact search before adding a vector database. Preserve compatibility and provide migration/rollback.
3. Batch embeddings with bounded concurrency and cache model initialization; measure peak RSS and throughput.
4. Make ingestion non-blocking with a bounded worker/status polling. A queue service is unnecessary for a single-node launch unless durability/concurrency measurements justify it.
5. Bound context/history by tokens; capture provider usage, timeouts, cancellation, and per-user quotas.
6. Add a labeled retrieval dataset; tune top-k/threshold only against measured recall and answer quality.

## P2 — experience and product

1. Show processing status via polling and accurate phase messaging; progress must distinguish bytes uploaded from document processing.
2. Add citations with genuine page numbers and click-to-open page support after page-preserving extraction.
3. Lazy-load routes and heavy Markdown/code rendering; measure built output and Core Web Vitals.
4. Add request cancellation and recoverable upload/chat error states.
5. Use a compact set of high-value features: multi-document comparison and export after core citations are dependable.

## P3 — conditional capabilities

- OCR only for pages with low text density, if scanned-document demand is validated and CPU/cost is acceptable.
- Hybrid lexical retrieval or reranking only if an evaluation set shows a material quality gap.
- ANN indexing only after exact-search measurements show unacceptable latency at expected corpus sizes.
- BYOK/local LLM only after product demand and security implications are understood.

## Feature opportunity ranking

Scores are planning estimates (1 low, 5 high), not user research.

| Feature | User value | Effort | Runtime cost | Differentiation | Maintenance |
|---|---:|---:|---:|---:|---:|
| Accurate page citations and page open | 5 | 3 | 1 | 4 | 2 |
| Multiple-PDF comparison | 5 | 4 | 3 | 4 | 4 |
| Research paper explanation | 4 | 2 | 2 | 3 | 2 |
| Document summaries | 4 | 2 | 3 | 2 | 2 |
| Study mode / flashcards / questions | 4 | 3 | 4 | 3 | 3 |
| Table extraction | 4 | 4 | 3 | 4 | 4 |
| Library search | 3 | 2 | 1 | 2 | 2 |
| Conversation export | 3 | 1 | 1 | 1 | 1 |
| Multilingual questions | 3 | 2 | 2 | 2 | 2 |
| Privacy-focused local processing | 4 | 4 | 5 | 4 | 4 |

## Deployment and cost assumptions

Stages A/B/C (0–100 / 100–1,000 / 1,000–10,000 registered users) are not concurrency forecasts. Planning placeholders: 10% daily active users; 2 documents per registered user; 10 MB average PDF; 5 queries per active user per day. Replace with observed product telemetry. Local CPU embeddings imply sustained compute during ingestion and local LLM inference is not assumed. Database and backup pricing must be checked for the chosen region and retention.

| Stage | Architecture direction | Cost statement |
|---|---|---|
| A | One 1 CPU / 2 GB app instance, static frontend, private object storage; Atlas M0 only for development until its hard 512 MB limit/reliability becomes restrictive. | Planning estimate ~$25.38/mo at modeled LLM use, excluding production DB/transfer/domain. See `COST_ANALYSIS.md`. |
| B | Web plus bounded ingestion worker, durable object storage, paid database sized from actual metadata/conversation growth. | Planning subtotal ~$53.90/mo plus paid DB/transfer/domain at modeled LLM use; validate worker sizing with benchmarks. |
| C | Scale app/worker instances based on measured concurrency, explicit quotas/retention, production DB/backups, object storage, retrieval index chosen by corpus measurements. | Planning subtotal ~$140.35/mo plus paid DB/backups/transfer/domain at modeled LLM use; capacity counts are placeholders. |

Open questions that affect architecture: target hosting platform and persistent-volume guarantees, average concurrent chats, retention policy, privacy promises, and desired response SLO.
