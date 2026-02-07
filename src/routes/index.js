const router = require('express').Router();

router.get('/', (req,res) => {
    
    res.send('Welcome to Project 2 - My Lingala Dico API.');
});

module.exports = router;