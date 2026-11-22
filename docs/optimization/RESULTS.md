# SAGE optimization results

Date: 2026-11-22. This first batch focuses on security, correctness, and frontend delivery. It does not claim improvements to PDF processing or RAG latency: no representative PDFs, MongoDB, browser lab, or paid LLM workload were available.

## Changes

- Removed the unauthenticated `/uploads` static mount. Uploaded PDFs no longer have a direct public URL.
- Added a server-side `%PDF-` signature check within the first 1024 bytes after Multer saves the upload; invalid bytes are removed and rejected.
- Added startup validation for missing/placeholder JWT secrets, with a minimum 32-character requirement in production.
- Sanitized production 5xx responses and provider failures; stopped logging question text, retrieved source snippets, and provider error bodies.
- Moved retrieved PDF text out of the system policy and labeled it untrusted evidence; prompt rules explicitly tell the model to ignore instructions in evidence/history.
- Added per-vector-store single-flight restore to prevent concurrent first questions from duplicating PDF parse/embed work.
- Changed PDF file reading to asynchronous I/O.
- Added lazy route loading and lazy Markdown/code renderer loading.
- Added ESLint flat config and corrected existing empty catches and hook dependency warnings.
- Added benchmark scaffold and focused Node security middleware tests.

## Before / after measurements

| Metric | Before | After | Status |
|---|---:|---:|---|
| PDF processing latency | — | — | Unmeasured; no representative fixtures |
| Retrieval latency | — | — | Unmeasured; requires corpus and warm index |
| LLM time to first token | — | — | Current provider is non-streaming; unmeasured |
| End-to-end answer latency | — | — | No database/provider workload executed |
| Peak RAM / CPU | — | — | Unmeasured |
| LLM token usage / cost per query | — | — | Provider usage is not currently persisted |
| Retrieval accuracy | — | — | No labeled QA dataset |
| Frontend built chunks | ChatPage JS 654.05 KB (235.00 KB gzip); index JS 65.38 KB (24.96 KB gzip) | ChatPage JS 11.29 KB (3.93 KB gzip); index JS 65.36 KB (24.94 KB gzip); Markdown renderer JS 643.31 KB (231.55 KB gzip) | Chat route shrank by 98.3% in raw bytes; heavy renderer now loads only when a chat message renders. Markdown chunk remains large and Vite reports a >500 KB chunk warning. |

## Verification

- Backend `npm test`: 3/3 middleware tests pass (valid PDF signature, invalid PDF rejection and cleanup, production 5xx sanitization).
- Frontend `npm run lint`: pass after adding flat config and fixing surfaced issues.
- Frontend production build: pass after Markdown lazy split; Vite still warns that the deferred Markdown/syntax-highlighting chunk is over 500 KB minified.
- Backend syntax checks: pass for edited server, RAG pipeline, PDF validator, and benchmark script.
- Backend `npm ci` could not run because the checked-in package lock and package manifest are inconsistent. Dependencies were installed locally with `--legacy-peer-deps --package-lock=false` only to run tests; tracked lockfiles were not rewritten.
- `npm audit` reported 44 backend advisories (2 critical, 20 high, 22 moderate). Recommended fixes include major LangChain/transformer upgrades, so they need compatibility and lockfile remediation rather than an unreviewed mass upgrade.

## Remaining risks

Vectors remain process-local and uploads still process synchronously. The signature check is a file-type sanity check, not a malware scan or parser sandbox. Any future viewer must verify ownership. Prompt injection defenses are model instructions, not a formal guarantee. No production security certification is implied.

## Batch 2: optional tracing (2026-11-22)

Affected files: `backend/server.js`, `backend/tracing.js`, `backend/.env.example`, and `scripts/benchmark-tracing-startup.js`.

The server now initializes OpenTelemetry only with `OTEL_ENABLED=true`. An enabled deployment must also set `OTEL_EXPORTER_OTLP_ENDPOINT`. The server owns tracer shutdown during SIGTERM, so the tracer no longer exits independently before HTTP connections close. Existing deployments that require traces should set both environment variables. Rollback: set `OTEL_ENABLED=true` with the collector endpoint; no data migration is involved.

Seven cold Node processes per mode were measured with `node ../scripts/benchmark-tracing-startup.js` from `backend/` on Node v26.12.1. The probe measures `dotenv` and tracing initialization through the next event-loop turn, excluding Express, MongoDB, model inference, and requests. It does not send traces.

| Probe metric, p50 | Tracing enabled (previous default behavior) | Tracing disabled (new default) | Change |
|---|---:|---:|---:|
| Initialization elapsed | 811.59 ms | 14.39 ms | 98.2% lower |
| RSS after initialization | 92.57 MB | 52.30 MB | 43.5% lower |
| CPU time | 913.42 ms | 16.93 ms | 98.1% lower |

The pre-change direct tracing probe had a 1,017.96 ms median and ~93.1 MB RSS over seven runs. The paired post-change modes provide the cleaner comparison above because both use the same benchmark code. Startup may vary with disk cache, runtime, and host load. No request latency or LLM cost improvement is claimed.

Validation: backend `npm test` passed 3/3; syntax checks and `git diff --check` passed. Enabled tracing initialized in the paired benchmark using an explicit local collector URL. Full Express/Mongo integration and actual trace delivery remain unverified.
