/**
 * Conversation Model
 * MongoDB schema for chat conversations linked to documents
 */

const mongoose = require('mongoose');

// Message sub-schema
const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // Source chunks from RAG retrieval (for citations)
    sources: [
      {
        content: String,
        pageNumber: Number,
        chunkIndex: Number,
        score: Number,
        documentName: String,
      },
    ],
    // Token usage tracking (future: billing)
    tokensUsed: {
      type: Number,
      default: 0,
    },
    // Latency tracking
    responseTimeMs: {
      type: Number,
      default: 0,
    },
    // User feedback on AI responses
    feedback: {
      type: String,
      enum: ['thumbs_up', 'thumbs_down', null],
      default: null,
    },
  },
  { timestamps: true }
);

// Conversation schema
const conversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'New Conversation',
      trim: true,
      maxlength: 200,
    },
    messages: [messageSchema],
    // Conversation metadata
    messageCount: {
      type: Number,
      default: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    // For generating the auto-title from the first question
    titleGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ─────────────────────────────────────────────────────────────────
conversationSchema.index({ user: 1, updatedAt: -1 });
conversationSchema.index({ user: 1, document: 1 });
conversationSchema.index({ user: 1, isArchived: 1 });

// ── Pre-save: sync message count ─────────────────────────────────────────────
conversationSchema.pre('save', function (next) {
  this.messageCount = this.messages.length;
  next();
});

// ── Instance Methods ─────────────────────────────────────────────────────────
conversationSchema.methods.getLatestMessages = function (limit = 10) {
  return this.messages.slice(-limit);
};

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;
