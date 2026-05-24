/**
 * Chat Routes
 */

const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const { sendMessage, submitFeedback } = require('../controllers/chatController');

const router = express.Router();

router.use(protect);

const messageValidation = [
  body('question')
    .trim()
    .notEmpty()
    .withMessage('Question is required')
    .isLength({ max: 2000 })
    .withMessage('Question cannot exceed 2000 characters'),
  body('documentId')
    .notEmpty()
    .withMessage('Document ID is required'),
];

router.post('/', messageValidation, sendMessage);
router.post('/feedback', protect, submitFeedback);

module.exports = router;
