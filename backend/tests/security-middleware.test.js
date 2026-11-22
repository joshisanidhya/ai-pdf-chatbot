const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const validatePdf = require('../middleware/validatePdf');
const { errorHandler } = require('../middleware/errorHandler');

async function withUpload(bytes, run) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'sage-upload-'));
  const filePath = path.join(directory, 'upload.pdf');
  await fs.writeFile(filePath, bytes);
  try {
    await run(filePath);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
}

test('PDF validation accepts a PDF signature within the first 1024 bytes', async () => {
  await withUpload(Buffer.concat([Buffer.from('%PDF-1.7\n'), Buffer.from('content')]), async (filePath) => {
    let passed = false;
    await validatePdf({ file: { path: filePath } }, {}, (error) => {
      assert.ifError(error);
      passed = true;
    });
    assert.equal(passed, true);
  });
});

test('PDF validation rejects and removes non-PDF bytes', async () => {
  await withUpload(Buffer.from('not a PDF'), async (filePath) => {
    let status;
    let body;
    const response = {
      status(code) { status = code; return this; },
      json(value) { body = value; return this; },
    };
    await validatePdf({ file: { path: filePath } }, response, (error) => assert.ifError(error));
    assert.equal(status, 400);
    assert.equal(body.success, false);
    await assert.rejects(fs.access(filePath));
  });
});

test('production error handler hides internal server error details', () => {
  const previousMode = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  let status;
  let payload;
  const response = {
    status(code) { status = code; return this; },
    json(value) { payload = value; return this; },
  };
  try {
    errorHandler(new Error('private provider response'), { path: '/api/chat', method: 'POST', ip: '127.0.0.1' }, response);
    assert.equal(status, 500);
    assert.equal(payload.message, 'An unexpected server error occurred');
  } finally {
    if (previousMode === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousMode;
  }
});
