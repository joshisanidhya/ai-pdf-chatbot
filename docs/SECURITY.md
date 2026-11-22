# Security and privacy

JWT routes load the current user from MongoDB, and document/conversation operations scope queries to that user. Uploaded PDFs are not statically served. The backend checks a PDF signature and size, uses security headers and a global IP limit, and hides production 5xx details. Retrieved text is labeled untrusted in the LLM prompt. Vector snapshots are stored in per-user private directories and removed on document deletion.

Known limits: JWTs live in browser localStorage; there is no user-level quota or account deletion endpoint; PDFs are parsed in the web process without a sandbox; old vector snapshots may lack page references; a model can still follow malicious text. `npm audit` has remaining high findings in older LangChain, transformer, and telemetry dependency paths. Avoid claims of complete security until integration and adversarial tests cover these cases. See [audit](optimization/AUDIT.md).
