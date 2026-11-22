# SAGE performance baseline and benchmark plan

Date: 2026-11-22. **No end-to-end RAG baseline is claimed.** The repository contains no representative PDF corpus; the working environment has not been verified to have MongoDB, model weights, or provider credentials. The tracing startup component is measured separately below.

## Baseline metric table

| Metric | Baseline | Measurement state |
|---|---:|---|
| Upload end-to-end, 5 / 25 / 100 / 300+ pages | — | Unmeasured; upload includes synchronous parsing and embedding |
| Extraction / chunking / embedding / index build | — | Unmeasured; instrumentation script to be added |
| Retrieval latency p50 / p95 | — | Unmeasured; requires warm vector store and corpus |
| LLM time to first token | — | Not applicable to current non-streaming API; paid calls intentionally omitted |
| LLM total response latency p50 / p95 | — | Unmeasured; requires explicitly configured provider and approval for paid workload |
| Frontend production bundle / CWV | — | Unmeasured; use `npm run build`; CWV requires browser and representative deployment |
| Peak RSS / CPU | — | Unmeasured; collect process metrics alongside the script |
| DB p50 / p95 and concurrent throughput | — | Unmeasured; requires MongoDB and controlled load test |
| Token usage / estimated cost per query | — | Unmeasured; provider currently does not return or persist usage |
| Retrieval accuracy | — | Unmeasured; no labeled evaluation set exists |

Tracing startup is the first measured infrastructure metric. Before the opt-in change, seven cold processes spent a median 1,017.96 ms initializing tracing with ~93.1 MB RSS. A repeatable enabled/disabled comparison and limitations are recorded in `RESULTS.md`. This is a startup component benchmark, not an API latency baseline.

## Repeatable workload

Use consented, non-sensitive PDFs at 5, 25, 100, and (where resource limits allow) 300+ pages. Include text-heavy, table/mixed-layout, and scanned files. Record file size, page count, text density, and source. Keep private documents out of committed fixtures. For each file run at least five cold-process and ten warm-process iterations; report median (p50), p95, max RSS, CPU time, event-loop delay, chunk count, and failures. Separate file read/extract, chunk, embedding, index, retrieval, and provider time. The current API cannot measure TTFT because it buffers the provider response.

Before measurements, pin Node/runtime and dependency lockfiles, machine CPU/RAM, model ID and quantization, MongoDB version/placement, provider/model, temperature/output limit, and concurrency. Use `LLM_PROVIDER=mock` for pipeline smoke checks; do not use it to report LLM latency or quality. Only run paid-provider workloads after explicitly choosing an affordable model and request volume.

## Cost and quality

Current code stores `tokensUsed: 0` and does not persist provider usage; cost cannot be inferred reliably from text character counts. Add usage from provider response metadata before cost reporting. Retrieval evaluation should use a small versioned set of questions, expected answer facts, and expected source chunk/page; report recall@k and grounded answer review. Do not claim an accuracy score from synthetic questions alone.

## Benchmark script

`scripts/benchmark-ingestion.js` is intended to report local PDF extraction and chunking durations without making LLM calls. Run from `backend/` with `node ../scripts/benchmark-ingestion.js <pdf-path>`. Embedding timings are optional and require `--embeddings`; model download/inference can consume substantial RAM/CPU. Never run it against confidential content on a shared host. Benchmark suite currently unexecuted due to lack of supplied fixtures and resource baseline.
