# Engineering decisions

| Decision | Reason | Tradeoff |
|---|---|---|
| Retain modular Express + MongoDB | Existing features already use them; no measured need for services | Single app handles CPU-heavy ingestion today |
| Keep exact cosine search | Small per-document collections do not justify ANN infrastructure yet | Retrieval cost grows linearly with chunk count |
| Snapshot vectors to private disk | Avoid re-embedding after restart on one durable host | Adds disk/JSON memory use; multi-host needs shared persistence |
| Keep local MiniLM embeddings | No embedding API bill, existing model behavior | CPU and RAM cost; sequential chunk inference is slow |
| Make tracing optional | Unconfigured SDK added measurable startup and RSS overhead | Deployment must opt in explicitly |
| Defer OCR, reranking, agents, extra LLM calls | No quality/cost benchmark justifies them | Scanned PDFs and hard retrieval cases remain unsupported |

The [roadmap](optimization/ROADMAP.md) lists conditions for revisiting these choices.
