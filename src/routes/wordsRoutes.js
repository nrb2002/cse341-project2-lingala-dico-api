const express = require('express');
const router = express.Router();
const wordsController = require('../controllers/wordsController');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');

router.get('/', wordsController.getAllWords);

// router.get(
//   '/:id', 
//   validate.checkId,
//   wordsController.getSingleWord
// );

//Get a word's translation using its source
router.get(
  '/:sourceWord', 
  validate.sourceWordParam,
  wordsController.getSingleWord
);

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
  validate.checkId, 
  wordsController.updateWord
);

router.delete(
  '/:id', 
  auth.requiresAuth, 
  validate.checkId, 
  wordsController.deleteWord
);


module.exports = router;
