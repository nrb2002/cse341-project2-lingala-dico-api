const express = require('express');
const router = express.Router();
const wordsController = require('../controllers/wordsController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.get('/', wordsController.getAllWords);

router.post(
  '/',
  auth.requiresAuth,
  validate.word,
  wordsController.createWord
);

router.put(
  '/:id', 
  auth.requiresAuth, 
  validate.word, 
  wordsController.updateWord
);

router.delete(
  '/:id', 
  auth.requiresAuth, 
  wordsController.deleteWord
);


module.exports = router;
