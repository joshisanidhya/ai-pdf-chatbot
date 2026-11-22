# RAG pipeline

1. Multer limits PDF size and checks extension/MIME; byte signature is checked after upload.
2. `pdf-parse` extracts text one page at a time. Scanned pages are not OCRed. Each new chunk keeps its source page number.
3. LangChain's recursive splitter creates roughly 1,000-character chunks with 200-character overlap within each page.
4. One local `Xenova/all-MiniLM-L6-v2` model embeds chunks sequentially. Vectors are saved as private, owner-scoped JSON snapshots.
5. `MemoryVectorStore` performs exact cosine search. The top four chunks above the existing score threshold are sent as untrusted evidence with recent conversation history to the configured LLM.
6. The complete answer and retrieved source snippets are saved to MongoDB. Current source cards generally have no page number; do not interpret them as page-accurate citations.

Current tradeoff: exact search is simple for small collections, while JSON snapshots avoid re-embedding on restart but add disk and JSON parse overhead. Older snapshots without page metadata require reprocessing for page citations. No cross-document search or measured QA accuracy is claimed. See [audit](optimization/AUDIT.md) and [roadmap](optimization/ROADMAP.md).
