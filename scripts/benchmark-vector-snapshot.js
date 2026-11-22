#!/usr/bin/env node
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

function percentile(values, fraction) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(sorted.length * fraction) - 1];
}

async function time(action) {
  const start = process.hrtime.bigint();
  await action();
  return Number(process.hrtime.bigint() - start) / 1e6;
}

async function main() {
  const count = Number.parseInt(process.argv[2], 10) || 1000;
  if (count < 1 || count > 10000) throw new Error('Chunk count must be 1–10000');
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'sage-index-bench-'));
  process.env.VECTOR_INDEX_DIR = directory;
  const { saveSnapshot, loadSnapshot } = require('../backend/rag/vectorSnapshot');
  const userId = 'a'.repeat(24);
  const documentId = 'b'.repeat(24);
  const vectorStoreId = randomUUID();
  const vectors = Array.from({ length: count }, (_, index) => Array.from({ length: 384 }, (_, dimension) => ((index + dimension) % 100) / 100));
  const chunks = Array.from({ length: count }, (_, index) => ({ pageContent: `Synthetic chunk ${index} `.repeat(20), metadata: { chunkIndex: index } }));
  try {
    const saveMs = await time(() => saveSnapshot(userId, vectorStoreId, documentId, vectors, chunks));
    const loadMs = [];
    for (let i = 0; i < 10; i += 1) {
      loadMs.push(await time(() => loadSnapshot(userId, vectorStoreId, documentId)));
    }
    const file = path.join(directory, userId, `${vectorStoreId}.json`);
    console.log(JSON.stringify({ node: process.version, chunkCount: count, dimensions: 384, bytes: (await fs.stat(file)).size, saveMs, loadP50Ms: percentile(loadMs, 0.5), loadP95Ms: percentile(loadMs, 0.95), rssBytes: process.memoryUsage().rss, note: 'Synthetic snapshot I/O only; no PDF parse, embedding inference, MongoDB, or LLM.' }, null, 2));
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
