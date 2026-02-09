const express = require('express');
const router = express.Router();
const wordsController = require('../controllers/wordsController');
const validate = require('../middleware/validate');
const { isAuthenticated } = require('../middleware/authenticate');

// Get all words
router.get(
  '/all',
  isAuthenticated,
  wordsController.getAllWords
);

// Filter by status
router.get(
  '/status/:status',
  //isAuthenticated,
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
  //isAuthenticated,
  validate.checkId,
  wordsController.validateWord
);

// Delete a word
router.delete(
  '/:id',
  //isAuthenticated,
  validate.checkId,
  wordsController.deleteWord
);

module.exports = router;
