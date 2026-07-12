/**
 * Document Model
 * MongoDB schema for uploaded PDF documents with processing metadata
 */

const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      default: 'application/pdf',
    },
    // Processing status
    status: {
      type: String,
      enum: ['uploading', 'processing', 'ready', 'failed'],
      default: 'uploading',
    },
    processingError: {
      type: String,
      default: null,
    },
    // Extracted content metadata
    pageCount: {
      type: Number,
      default: 0,
    },
    wordCount: {
      type: Number,
      default: 0,
    },
    chunkCount: {
      type: Number,
      default: 0,
    },
    // Vector store reference
    vectorStoreId: {
      type: String,
      default: null,
    },
    // Preview of extracted text
    textPreview: {
      type: String,
      default: null,
    },
    // Tags for organization (future feature)
    tags: {
      type: [String],
      default: [],
    },
    // Number of times this document was queried
    queryCount: {
      type: Number,
      default: 0,
    },
    lastQueried: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ─────────────────────────────────────────────────────────────────
documentSchema.index({ user: 1, createdAt: -1 });
documentSchema.index({ user: 1, status: 1 });
documentSchema.index({ name: 'text', originalName: 'text' }); // text search

// ── Virtuals ─────────────────────────────────────────────────────────────────
documentSchema.virtual('fileSizeMB').get(function () {
  return (this.fileSize / (1024 * 1024)).toFixed(2);
});

documentSchema.virtual('isReady').get(function () {
  return this.status === 'ready';
});

const Document = mongoose.model('Document', documentSchema);
module.exports = Document;
