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
