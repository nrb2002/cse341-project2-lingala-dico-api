const express = require('express');
const router = express.Router();
const wordsController = require('../controllers/wordsController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// Get all words
router.get(
  '/all',
  //auth.requiresAuth('admin', 'moderator'),
  wordsController.getAllWords
);

// Filter by status
router.get(
  '/status/:status',
  //auth.requiresAuth('admin', 'moderator'),
  wordsController.filterByStatus
);

// Get validated word by sourceWord
router.get(
  '/:sourceWord',
  validate.sourceWordParam,
  wordsController.getValidatedWord
);

// Submit a new word (optional fields allowed)
router.post(
  '/',
  validate.word,
  wordsController.submitWord
);

// Validate a word submission
router.put(
  '/:id/validate',
  //auth.requiresAuth('admin', 'moderator'),
  validate.checkId,
  wordsController.validateWord
);

// Delete a word
router.delete(
  '/:id',
  //auth.requiresAuth('admin', 'moderator'),
  validate.checkId,
  wordsController.deleteWord
);

module.exports = router;
