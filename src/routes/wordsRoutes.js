const express = require('express');
const router = express.Router();
const wordsController = require('../controllers/wordsController');
const validate = require('../middleware/validate');
const { isAuthenticated, isModerator } = require('../middleware/authenticate'); 

/** ****************************************************
 *  MODERATOR/ADMIN ROUTES (require login)
 ******************************************************/
router.get(
    '/all', 
    //isAuthenticated, 
    // isModerator, 
    wordsController.getAllWords
);

router.get(
    '/status/:status', 
    // isAuthenticated, 
    // isModerator, 
    wordsController.filterByStatus);

router.put(
    '/:id/validate', 
    //isAuthenticated, 
    //isModerator, 
    validate.checkId, 
    wordsController.validateWord
);

router.delete(
    '/:id', 
    //isAuthenticated, 
    //isModerator, 
    validate.checkId, 
    wordsController.deleteWord);


/** ****************************************************
 *  PUBLIC / CONTRIBUTOR ROUTES
 ******************************************************/
router.get('/:sourceWord', validate.sourceWordParam, wordsController.getValidatedWord);

router.post('/', validate.word, wordsController.submitWord);

module.exports = router;
