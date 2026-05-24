/**
 * Chat Controller
 * Handles RAG-powered question answering against uploaded documents
 */

const { validationResult } = require('express-validator');
const Document = require('../models/Document');
const Conversation = require('../models/Conversation');
const { queryDocument, restoreVectorStore } = require('../rag/ragPipeline');
const logger = require('../utils/logger');

/**
 * @route   POST /api/chat
 * @desc    Send a message and get an AI response using RAG
 * @access  Private
 */
const sendMessage = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const { question, documentId, conversationId } = req.body;

    // ── Validate document ─────────────────────────────────────────
    const document = await Document.findOne({
      _id: documentId,
      user: req.user._id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    if (document.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: `Document is not ready for querying. Status: ${document.status}`,
      });
    }

    // ── Get or create conversation ─────────────────────────────────
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({
        _id: conversationId,
        user: req.user._id,
        document: documentId,
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: 'Conversation not found',
        });
      }
    } else {
      // Auto-generate title from first question (truncate to 60 chars)
      const title = question.length > 60 ? question.slice(0, 57) + '...' : question;
      conversation = await Conversation.create({
        user: req.user._id,
        document: documentId,
        title,
        titleGenerated: true,
        messages: [],
      });
    }

    // ── Restore vector store if not in cache (server restart) ──────
    await restoreVectorStore(document.filePath, document.vectorStoreId, {
      documentName: document.name,
      documentId: document._id.toString(),
      userId: req.user._id.toString(),
    });

    // ── Retrieve conversation history for context ──────────────────
    const history = conversation.messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // ── Run RAG query pipeline ─────────────────────────────────────
    logger.info(`💬 Processing query: "${question.slice(0, 80)}..." for doc: ${documentId}`);
    const startTime = Date.now();

    const { answer, sources, responseTimeMs } = await queryDocument(
      question,
      document.vectorStoreId,
      history
    );

    // ── Save messages to conversation ──────────────────────────────
    conversation.messages.push({
      role: 'user',
      content: question,
    });

    conversation.messages.push({
      role: 'assistant',
      content: answer,
      sources: sources.map((s) => ({
        content: s.content,
        pageNumber: s.metadata?.pageNumber || null,
        chunkIndex: s.metadata?.chunkIndex || 0,
        score: s.score,
        documentName: document.name,
      })),
      tokensUsed: 0, // Update if using provider with token tracking
      responseTimeMs,
    });

    await conversation.save();

    // ── Update document query stats ────────────────────────────────
    document.queryCount += 1;
    document.lastQueried = new Date();
    await document.save({ validateBeforeSave: false });

    logger.info(`✅ Response generated in ${responseTimeMs}ms`);

    res.json({
      success: true,
      data: {
        conversationId: conversation._id,
        question,
        answer,
        sources,
        responseTimeMs,
        messageId: conversation.messages[conversation.messages.length - 1]._id,
      },
    });
  } catch (error) {
    logger.error('Chat error:', error.message);
    next(error);
  }
};

/**
 * @route   POST /api/chat/feedback
 * @desc    Submit feedback on an AI response
 * @access  Private
 */
const submitFeedback = async (req, res, next) => {
  try {
    const { conversationId, messageId, feedback } = req.body;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    const message = conversation.messages.id(messageId);
    if (!message || message.role !== 'assistant') {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    message.feedback = feedback;
    await conversation.save();

    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendMessage, submitFeedback };
