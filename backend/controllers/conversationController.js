/**
 * Conversation Controller
 * CRUD operations for managing chat conversations
 */

const Conversation = require('../models/Conversation');
const logger = require('../utils/logger');

/**
 * @route   GET /api/conversations
 * @desc    Get all conversations for authenticated user
 * @access  Private
 */
const getConversations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const documentId = req.query.documentId;
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id, isArchived: false };
    if (documentId) filter.document = documentId;

    const [conversations, total] = await Promise.all([
      Conversation.find(filter)
        .populate('document', 'name originalName status pageCount')
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-messages'), // Don't return messages in list view
      Conversation.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        conversations,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/conversations/:id
 * @desc    Get a specific conversation with all messages
 * @access  Private
 */
const getConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('document', 'name originalName status pageCount chunkCount');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    res.json({ success: true, data: { conversation } });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/conversations/:id
 * @desc    Update conversation (title, pin, archive)
 * @access  Private
 */
const updateConversation = async (req, res, next) => {
  try {
    const { title, isPinned, isArchived } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (isPinned !== undefined) updates.isPinned = isPinned;
    if (isArchived !== undefined) updates.isArchived = isArchived;

    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updates,
      { new: true, runValidators: true }
    ).select('-messages');

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    res.json({
      success: true,
      message: 'Conversation updated',
      data: { conversation },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/conversations/:id
 * @desc    Delete a conversation
 * @access  Private
 */
const deleteConversation = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found' });
    }

    logger.info(`🗑️  Conversation deleted: ${conversation._id}`);
    res.json({ success: true, message: 'Conversation deleted' });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/conversations
 * @desc    Clear all conversations for a document
 * @access  Private
 */
const clearConversations = async (req, res, next) => {
  try {
    const { documentId } = req.query;

    const filter = { user: req.user._id };
    if (documentId) filter.document = documentId;

    const result = await Conversation.deleteMany(filter);

    res.json({
      success: true,
      message: `${result.deletedCount} conversation(s) deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getConversations,
  getConversation,
  updateConversation,
  deleteConversation,
  clearConversations,
};
