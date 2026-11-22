# Resume bullet suggestions

Use only bullets matching the code that ships and the measurements you can reproduce:

- Secured a React/Express PDF chat app by removing public PDF serving, validating uploaded file signatures, and scoping vector snapshots to document owners.
- Added durable local vector snapshots with atomic writes and legacy-document fallback, avoiding repeat PDF embedding after process restarts on a single durable host.
- Reduced the built chat route JavaScript chunk from 654 KB to 11.3 KB by lazy loading routes and Markdown rendering; the Markdown renderer remains a separate deferred 643 KB chunk.
- Made OpenTelemetry opt in; a seven-process component benchmark measured startup initialization median falling from 812 ms to 14 ms and RSS from 92.6 MB to 52.3 MB when disabled.
- Added Node security/snapshot tests and CI checks for backend tests, frontend lint, and production build.

Do not claim lower end-to-end query latency, retrieval accuracy, or production scalability until measured with representative PDFs and concurrent users.
