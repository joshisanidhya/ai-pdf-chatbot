const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { MemoryVectorStore } = require('langchain/vectorstores/memory');

test('vector snapshot restores owner-scoped vectors and deletion removes them', async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'sage-index-'));
  process.env.VECTOR_INDEX_DIR = directory;
  const { saveSnapshot, loadSnapshot, deleteSnapshot } = require('../rag/vectorSnapshot');
  const userId = 'a'.repeat(24);
  const documentId = 'b'.repeat(24);
  const vectorStoreId = randomUUID();
  const vectors = [Array(384).fill(0), Array(384).fill(0)];
  vectors[0][0] = 1;
  vectors[1][1] = 1;
  const chunks = [
    { pageContent: 'Private document text', metadata: { pageNumber: 2, filePath: '/private/file.pdf' } },
    { pageContent: 'Other private text', metadata: { pageNumber: 3 } },
  ];
  try {
    await saveSnapshot(userId, vectorStoreId, documentId, vectors, chunks);
    const entries = await loadSnapshot(userId, vectorStoreId, documentId);
    assert.equal(entries[0].content, 'Private document text');
    assert.equal(entries[0].embedding.length, 384);
    assert.equal(entries[0].metadata.pageNumber, 2);
    assert.equal(entries[0].metadata.filePath, undefined);
    const embedder = { embedQuery: async () => vectors[0] };
    const before = new MemoryVectorStore(embedder);
    const after = new MemoryVectorStore(embedder);
    await before.addVectors(vectors, chunks);
    await after.addVectors(entries.map((entry) => entry.embedding),
      entries.map((entry) => ({ pageContent: entry.content, metadata: entry.metadata })));
    const beforeResults = await before.similaritySearchWithScore('first', 2);
    const afterResults = await after.similaritySearchWithScore('first', 2);
    assert.deepEqual(afterResults.map(([document, score]) => [document.pageContent, score]),
      beforeResults.map(([document, score]) => [document.pageContent, score]));
    assert.equal(await loadSnapshot('c'.repeat(24), vectorStoreId, documentId), null);
    await assert.rejects(loadSnapshot(userId, vectorStoreId, 'c'.repeat(24)));
    await deleteSnapshot(userId, vectorStoreId);
    assert.equal(await loadSnapshot(userId, vectorStoreId, documentId), null);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
