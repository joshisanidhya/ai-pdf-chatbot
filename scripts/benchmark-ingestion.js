#!/usr/bin/env node
const fs = require('fs/promises');
const os = require('os');
const path = require('path');

const inputPath = process.argv.find((arg) => !arg.startsWith('--') && arg !== process.argv[0] && arg !== process.argv[1]);
const includeEmbeddings = process.argv.includes('--embeddings');

async function timed(label, operation) {
  const start = process.hrtime.bigint();
  const value = await operation();
  return { value, ms: Number(process.hrtime.bigint() - start) / 1e6, label };
}

async function main() {
  if (!inputPath) {
    console.error('Usage: node scripts/benchmark-ingestion.js <pdf-path> [--embeddings]');
    process.exitCode = 2;
    return;
  }

  const absolutePath = path.resolve(inputPath);
  const before = process.memoryUsage().rss;
  const { value: buffer, ms: readMs } = await timed('read', () => fs.readFile(absolutePath));
  let parse;
  try {
    parse = require(path.resolve(__dirname, '../backend/node_modules/pdf-parse'));
  } catch {
    throw new Error('Install backend dependencies before running this benchmark.');
  }
  const { value: parsed, ms: extractionMs } = await timed('extract', () => parse(buffer));

  const { chunkDocument } = require('../backend/rag/ragPipeline');
  const { value: chunks, ms: chunkingMs } = await timed('chunk', () => chunkDocument(parsed.text, { benchmark: true }));
  let embeddingMs = null;
  if (includeEmbeddings) {
    const embeddings = require('../backend/rag/embeddingService').getEmbeddings();
    const measured = await timed('embed', () => embeddings.embedDocuments(chunks.map((chunk) => chunk.pageContent)));
    embeddingMs = measured.ms;
  }

  console.log(JSON.stringify({
    file: path.basename(absolutePath), bytes: buffer.length, pages: parsed.numpages,
    chars: parsed.text.length, chunks: chunks.length, timingsMs: { read: readMs, extraction: extractionMs, chunking: chunkingMs, embedding: embeddingMs },
    rssBeforeBytes: before, rssAfterBytes: process.memoryUsage().rss,
    system: { node: process.version, platform: process.platform, arch: process.arch, cpus: os.cpus().length, totalMemoryBytes: os.totalmem() },
    note: 'Single run. Repeat cold and warm processes; this script does not measure database, retrieval, browser, concurrency, or LLM latency.'
  }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
