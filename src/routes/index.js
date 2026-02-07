const router = require('express').Router();

router.get('/', (req,res) => {
    res.send('Lingala Dico API - Default Route.');
});

module.exports = router;