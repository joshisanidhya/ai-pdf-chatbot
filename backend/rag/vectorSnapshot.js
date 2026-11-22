const fs = require('node:fs/promises');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const FORMAT_VERSION = 1;
const MODEL = 'Xenova/all-MiniLM-L6-v2';
const root = path.resolve(process.env.VECTOR_INDEX_DIR || path.join(__dirname, '../vector-indexes'));

function snapshotPath(userId, vectorStoreId) {
  if (!/^[a-f\d]{24}$/i.test(String(userId)) || !/^[a-f\d-]{36}$/i.test(String(vectorStoreId))) {
    throw new Error('Invalid vector snapshot identifier');
  }
  return path.join(root, String(userId), `${vectorStoreId}.json`);
}

async function saveSnapshot(userId, vectorStoreId, documentId, vectors, chunks) {
  const destination = snapshotPath(userId, vectorStoreId);
  const directory = path.dirname(destination);
  await fs.mkdir(directory, { recursive: true, mode: 0o700 });
  const temporary = path.join(directory, `.${vectorStoreId}.${randomUUID()}.tmp`);
  const snapshot = {
    version: FORMAT_VERSION,
    model: MODEL,
    userId: String(userId),
    documentId: String(documentId),
    entries: chunks.map((chunk, index) => ({
      content: chunk.pageContent,
      metadata: Object.fromEntries(Object.entries(chunk.metadata || {}).filter(([key]) => key !== 'filePath')),
      embedding: vectors[index],
    })),
  };
  let handle;
  try {
    handle = await fs.open(temporary, 'wx', 0o600);
    await handle.writeFile(JSON.stringify(snapshot));
    await handle.sync();
    await handle.close();
    handle = null;
    await fs.rename(temporary, destination);
  } finally {
    await handle?.close().catch(() => {});
    await fs.unlink(temporary).catch(() => {});
  }
}

async function loadSnapshot(userId, vectorStoreId, documentId) {
  let raw;
  try {
    raw = await fs.readFile(snapshotPath(userId, vectorStoreId), 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
  const data = JSON.parse(raw);
  if (data.version !== FORMAT_VERSION || data.model !== MODEL ||
      data.userId !== String(userId) || data.documentId !== String(documentId) ||
      !Array.isArray(data.entries) || data.entries.length === 0 ||
      !data.entries.every((entry) => typeof entry.content === 'string' &&
        Array.isArray(entry.embedding) && entry.embedding.length === 384 &&
        entry.embedding.every(Number.isFinite))) {
    throw new Error('Vector snapshot is incompatible or invalid');
  }
  return data.entries;
}

async function deleteSnapshot(userId, vectorStoreId) {
  await fs.unlink(snapshotPath(userId, vectorStoreId)).catch((error) => {
    if (error.code !== 'ENOENT') throw error;
  });
}

module.exports = { saveSnapshot, loadSnapshot, deleteSnapshot };
