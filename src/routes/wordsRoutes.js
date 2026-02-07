const express = require('express');
const router = express.Router();
const wordsController = require('../controllers/wordsController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

// PUBLIC: Get validated word by sourceWord
router.get(
  '/:sourceWord',
  validate.sourceWordParam,
  wordsController.getValidatedWord
);

// CONTRIBUTORS: Submit a new word (optional fields allowed)
router.post(
  '/',
  validate.word,
  wordsController.submitWord
);

// Validate a word submission
router.put(
  '/:id/validate',
  auth.requiresAuth,
  validate.checkId,
  wordsController.validateWord
);

// Filter by status
router.get(
  '/status/:status',
  auth.requiresAuth,
  wordsController.filterByStatus
);

// Get all words
router.get(
  '/all',
  auth.requiresAuth,
  wordsController.getAllWords
);

// Delete a word
router.delete(
  '/:id',
  auth.requiresAuth,
  validate.checkId,
  wordsController.deleteWord
);

module.exports = router;
