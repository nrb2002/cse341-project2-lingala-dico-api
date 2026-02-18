const router = require('express').Router();
const submissionsController = require('../controllers/submissionsController');
const { isAuthenticated, isModerator } = require('../middleware/authenticate');
const { validate, sourceWordParam, checkId } = require('../middleware/validate');

// Contributors
router.post(
    '/new', 
    //isAuthenticated, 
    submissionsController.submitWord
);

// Moderators
router.get(
    '/', 
    //isAuthenticated,
    // isModerator, 
    submissionsController.getPendingSubmissions
);
router.put(
    '/validate/:id', 
    // isAuthenticated,
    // isModerator,
    checkId,
    validate, 
    submissionsController.validateSubmission
);
router.delete(
    '/reject/:id',  
    // isAuthenticated,
    // isModerator,
    checkId, 
    submissionsController.rejectSubmission
);

module.exports = router;
