# SAGE cost analysis

Date: 2026-11-22. Prices below were checked against vendor pages on this date and can change. They are planning estimates, not quotes.

## Workload assumptions for planning

Use: 10% daily active users, two PDFs per registered user, 10 MB average PDF, and five questions per daily active user. Assume 2,000 input and 500 output tokens per query and 30 days/month. These are scenario inputs, not observed SAGE usage. Local CPU embeddings avoid per-token API charges but consume CPU/RAM and model storage during ingestion.

## Current cost drivers

- PDF files live on backend disk, requiring durable volume capacity and backups.
- Every process restart can cause PDF extraction and re-embedding on a document's first query.
- Embeddings run locally, sequentially, so large uploads consume CPU and extend request occupancy.
- Provider usage is not captured: conversation `tokensUsed` is always zero, preventing reliable per-user cost visibility or quotas.
- Context includes up to four chunks and up to ten previous messages; no token-budget accounting exists.
- Telemetry initializes OpenTelemetry and a default local collector endpoint even if no collector is configured.

## Cost controls to prioritize

1. Persist embeddings and avoid reprocessing; measure storage/backup tradeoff.
2. Add provider-returned token usage, model, latency, and request ID to sanitized telemetry.
3. Bound per-user document size/count, daily query count, and output tokens before paid usage.
4. Select model/provider from configuration; periodically verify current pricing directly with vendor pricing pages before launch.
5. Bound context by tokens and include only relevant history; compare answer quality on a labeled set.
6. Keep tracing optional and storage retention explicit.

## Scenario estimates

## Illustrative monthly estimates (USD)

Scenario only; no production host/provider is configured in this repo. Hosting example uses Render Hobby workspace and its 1 CPU / 2 GB web service at $25/mo. MongoDB Atlas M0 is shown only as a development starting point; it has a hard 512 MB limit and is not assumed production-ready. R2 Standard includes 10 GB-month storage and request allowances, then $0.015/GB-month. For LLM math only, use OpenRouter's listed Ministral 3 3B rates of $0.10/M input and $0.10/M output; this is not a quality recommendation and prices can change.

| Registered users | Stored PDFs (assumption) | Queries / month | LLM estimate | Render example | R2 storage estimate | Known subtotal |
|---:|---:|---:|---:|---:|---:|---:|
| 100 | 200 files / 2 GB | 1,500 | $0.38 | $25 web | $0.00 | ~$25.38 + database/transfer/domain |
| 1,000 | 2,000 files / 20 GB | 15,000 | $3.75 | $25 web + $25 worker | $0.15 | ~$53.90 + paid database/transfer/domain |
| 10,000 | 20,000 files / 200 GB | 150,000 | $37.50 | 4 × $25 instances (planning placeholder) | $2.85 | ~$140.35 + paid database/backups/transfer/domain |

LLM calculation: each query costs `(2,000 × $0.10 + 500 × $0.10) / 1,000,000 = $0.00025`; monthly query counts use 10% daily activity and five questions per active user per day. R2 figures include the first 10 GB free, then $0.015/GB-month, and exclude operations (assumed within included allowances). Render worker/instance counts are rough capacity placeholders, not validated requirements. MongoDB paid tier, backups, overage bandwidth, logs, taxes, email, and support are excluded, so these subtotals are not total-cost guarantees. The Stage A 2 GB of PDFs should live in private object storage rather than Atlas M0; migrate Mongo when its 512 MB limit or reliability constraints are reached.

Sources checked on 2026-11-22: [Render service pricing](https://render.com/pricing), [Render compute plan specifications](https://render.com/docs/compute-plans), [MongoDB Atlas pricing and free cluster limits](https://www.mongodb.com/pricing), [Cloudflare R2 pricing](https://developers.cloudflare.com/r2/pricing/), and [OpenRouter model pricing](https://openrouter.ai/models/).
