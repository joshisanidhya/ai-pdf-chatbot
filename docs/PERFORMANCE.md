# Performance evidence

Only component measurements are available. Tracing initialization p50 was 812 ms and 92.6 MB RSS when enabled versus 14 ms and 52.3 MB disabled, seven cold processes per mode. A synthetic 1,000-chunk vector snapshot loaded in 71.2 ms p50 and 107.8 ms p95 across ten loads; it occupied 2.33 MB. The built chat route chunk fell from 654 KB to 11.3 KB after lazy loading, while a 643 KB Markdown renderer chunk remains deferred.

These are not PDF processing, end-to-end response, retrieval accuracy, Core Web Vitals, or real-user benchmarks. Benchmark methods and missing measurements are in [BASELINE](optimization/BASELINE.md) and [RESULTS](optimization/RESULTS.md). Run `node scripts/benchmark-vector-snapshot.js` and `node scripts/benchmark-tracing-startup.js` to repeat local component probes.
