const router = require('express').Router();
const wordsController = require('../controllers/wordsController');
const { isAuthenticated } = require('../middleware/authenticate');
const { validate, sourceWordParam, checkId } = require('../middleware/validate');

// Admin endpoints
router.get(
    '/all', 
    //isAuthenticated, 
    wordsController.getAllWords
);
router.get(
    '/status/:status', 
    //isAuthenticated, 
    wordsController.getWordsByStatus
);
router.put(
    '/:id', 
    //isAuthenticated,
    checkId,
    validate,
    wordsController.editWord
);
router.delete(
    '/:id', 
    //isAuthenticated, 
    wordsController.deleteWord
);

// Public endpoint
router.get(
    '/:sourceWord',
    sourceWordParam, 
    wordsController.getWordBySource);





module.exports = router;
