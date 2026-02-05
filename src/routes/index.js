const router = require('express').Router();

router.get('/', (req,res) => {
    //#swagger.tags=['Home Page']
    res.send('Welcome to Project 2 - My English-Lingala Dictionary API.');
});

module.exports = router;