const router = require('express').Router();
const wordsController = require('../controllers/wordsController');
const { isAuthenticated, isAdmin } = require('../middleware/authenticate');
const { validate, sourceWordParam, checkId } = require('../middleware/validate');

/** ************************************ 
 * ADMINS ENDPOINTS
************************************  */
router.get(
    '/all', 
    //isAuthenticated,
    //isAdmin, 
    wordsController.getAllWords
);
router.get(
    '/status/:status', 
    //isAuthenticated,
    //isAdmin, 
    wordsController.getWordsByStatus
);

router.post(
    '/new',
    //isAuthenticated,
    //isAdmin,
    validate,
    wordsController.createWordAdmin
);

router.put(
    '/:id', 
    //isAuthenticated,
    //isAdmin,
    checkId,
    validate,
    wordsController.editWord
);
router.delete(
    '/:id', 
    //isAuthenticated, 
    //isAdmin,
    checkId,
    wordsController.deleteWord
);

/** ************************************ 
 * PUBLIC USERS ENDPOINT
************************************  */
router.get(
    '/:sourceWord',
    sourceWordParam, 
    wordsController.getWordBySource
);





module.exports = router;
