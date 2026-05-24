/**
 * Document Controller
 * Handles PDF upload, processing, listing, and deletion
 */

const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const Document = require('../models/Document');
const User = require('../models/User');
const { processDocument, clearVectorStore, restoreVectorStore } = require('../rag/ragPipeline');
const logger = require('../utils/logger');

/**
 * @route   POST /api/documents/upload
 * @desc    Upload and process a PDF document
 * @access  Private
 */
const uploadDocument = async (req, res, next) => {
  let doc = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a PDF file.',
      });
    }

    const { originalname, path: filePath, size } = req.file;
    const customName = req.body.name?.trim() || path.basename(originalname, '.pdf');
    const vectorStoreId = uuidv4();

    // Create document record with 'processing' status
    doc = await Document.create({
      user: req.user._id,
      name: customName,
      originalName: originalname,
      filePath,
      fileSize: size,
      status: 'processing',
      vectorStoreId,
    });

    // Increment user document count
    await User.findByIdAndUpdate(req.user._id, { $inc: { documentsCount: 1 } });

    // Respond immediately (processing happens async-like but we await it here)
    // In production, offload to a job queue (BullMQ/Redis)
    logger.info(`📤 Processing document: ${originalname} for user: ${req.user._id}`);

    const result = await processDocument(filePath, vectorStoreId, {
      documentName: customName,
      documentId: doc._id.toString(),
      userId: req.user._id.toString(),
    });

    // Update document with processing results
    doc.status = 'ready';
    doc.pageCount = result.pageCount;
    doc.wordCount = result.wordCount;
    doc.chunkCount = result.chunkCount;
    doc.textPreview = result.textPreview;
    await doc.save();

    logger.info(`✅ Document processed successfully: ${doc._id}`);

    res.status(201).json({
      success: true,
      message: 'Document uploaded and processed successfully',
      data: { document: doc },
    });
  } catch (error) {
    logger.error('Document upload/processing failed:', error.message);

    // Update document status to failed if record exists
    if (doc) {
      doc.status = 'failed';
      doc.processingError = error.message;
      await doc.save().catch(() => {});
    }

    // Clean up uploaded file on failure
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    next(error);
  }
};

/**
 * @route   GET /api/documents
 * @desc    Get all documents for the authenticated user
 * @access  Private
 */
const getDocuments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status; // filter by status
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const [documents, total] = await Promise.all([
      Document.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-filePath'), // Don't expose file system paths
      Document.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/documents/:id
 * @desc    Get a specific document by ID
 * @access  Private
 */
const getDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).select('-filePath');

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    res.json({ success: true, data: { document: doc } });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/documents/:id
 * @desc    Delete a document and its vector store
 * @access  Private
 */
const deleteDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Delete file from disk
    if (doc.filePath && fs.existsSync(doc.filePath)) {
      fs.unlinkSync(doc.filePath);
    }

    // Clear vector store from cache
    if (doc.vectorStoreId) {
      clearVectorStore(doc.vectorStoreId);
    }

    await doc.deleteOne();

    // Decrement user document count
    await User.findByIdAndUpdate(req.user._id, { $inc: { documentsCount: -1 } });

    logger.info(`🗑️  Document deleted: ${doc._id}`);

    res.json({ success: true, message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/documents/:id/reprocess
 * @desc    Re-process a failed or outdated document
 * @access  Private
 */
const reprocessDocument = async (req, res, next) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!doc) {
      return res.status(404).json({ success: false, message: 'Document not found' });
    }

    if (!fs.existsSync(doc.filePath)) {
      return res.status(400).json({
        success: false,
        message: 'Original file no longer exists. Please re-upload.',
      });
    }

    doc.status = 'processing';
    doc.processingError = null;
    await doc.save();

    const result = await processDocument(doc.filePath, doc.vectorStoreId, {
      documentName: doc.name,
      documentId: doc._id.toString(),
      userId: req.user._id.toString(),
    });

    doc.status = 'ready';
    doc.pageCount = result.pageCount;
    doc.wordCount = result.wordCount;
    doc.chunkCount = result.chunkCount;
    doc.textPreview = result.textPreview;
    await doc.save();

    res.json({
      success: true,
      message: 'Document reprocessed successfully',
      data: { document: doc },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  getDocument,
  deleteDocument,
  reprocessDocument,
};
