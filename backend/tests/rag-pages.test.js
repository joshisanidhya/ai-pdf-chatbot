const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { extractTextFromPDF, chunkDocument } = require('../rag/ragPipeline');

test('PDF extraction and chunking preserve page numbers', async () => {
  const fixture = path.join(__dirname, 'fixtures/two-pages.pdf');
  const extracted = await extractTextFromPDF(fixture);
  assert.equal(extracted.pageCount, 2);
  assert.match(extracted.pages[0].text, /amber constellation/);
  assert.match(extracted.pages[1].text, /cobalt telescope/);
  const chunks = await chunkDocument(extracted.pages, { documentId: 'fixture' });
  assert.ok(chunks.length >= 2);
  assert.ok(chunks.some((chunk) => chunk.metadata.pageNumber === 1 && chunk.pageContent.includes('amber')));
  assert.ok(chunks.some((chunk) => chunk.metadata.pageNumber === 2 && chunk.pageContent.includes('cobalt')));
  assert.equal(chunks.every((chunk) => chunk.metadata.documentId === 'fixture'), true);
});
