/**
 * Conversation Routes
 */

const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getConversations,
  getConversation,
  updateConversation,
  deleteConversation,
  clearConversations,
} = require('../controllers/conversationController');

const router = express.Router();

router.use(protect);

router.get('/', getConversations);
router.delete('/', clearConversations);
router.get('/:id', getConversation);
router.put('/:id', updateConversation);
router.delete('/:id', deleteConversation);

module.exports = router;
