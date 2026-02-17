const router = require('express').Router();
const submissionsController = require('../controllers/submissionsController');
const { isAuthenticated } = require('../middleware/authenticate');

// Contributors
router.post(
    '/contributor', 
    //isAuthenticated, 
    submissionsController.submitWord
);

// Moderators/Admin
router.get('/', isAuthenticated, submissionsController.getPendingSubmissions);
router.put('/validate/:id', isAuthenticated, submissionsController.validateSubmission);
router.delete('/reject/:id', isAuthenticated, submissionsController.rejectSubmission);

module.exports = router;
