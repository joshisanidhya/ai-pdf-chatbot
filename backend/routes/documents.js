/**
 * Document Routes
 */

const express = require('express');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const validatePdf = require('../middleware/validatePdf');
const {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  reprocessDocument,
} = require('../controllers/documentController');

const router = express.Router();

// All document routes require authentication
router.use(protect);

router.get('/', getDocuments);
router.post('/upload', upload.single('pdf'), validatePdf, uploadDocument);
router.get('/:id', getDocument);
router.delete('/:id', deleteDocument);
router.post('/:id/reprocess', reprocessDocument);

module.exports = router;
