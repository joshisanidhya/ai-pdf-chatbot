const fs = require('fs/promises');

// PDF readers permit a header within the first 1024 bytes. MIME type and
// filename are supplied by the client, so verify the actual uploaded bytes.
async function validatePdf(req, res, next) {
  if (!req.file) return next();

  let handle;
  let isPdf = false;
  let readError;
  try {
    handle = await fs.open(req.file.path, 'r');
    const header = Buffer.alloc(1024);
    const { bytesRead } = await handle.read(header, 0, header.length, 0);
    isPdf = header.subarray(0, bytesRead).includes(Buffer.from('%PDF-'));
  } catch (error) {
    readError = error;
  } finally {
    await handle?.close().catch(() => {});
  }

  if (readError) {
    await fs.unlink(req.file.path).catch(() => {});
    return next(readError);
  }

  if (!isPdf) {
    await fs.unlink(req.file.path).catch(() => {});
    return res.status(400).json({ success: false, message: 'The uploaded file is not a valid PDF.' });
  }
  return next();
}

module.exports = validatePdf;
