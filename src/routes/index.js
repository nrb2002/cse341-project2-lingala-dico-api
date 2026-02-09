const router = require('express').Router();
const passport = require('passport');

/** ************************************************
 * HOME PAGE ROUTE
 ************************************************ */
router.get('/', (req, res) => {
  res.send('Home - Lingala Dico API');
});

/** ************************************************
 * LOGIN ROUTE (GitHub OAuth)
 ************************************************ */
router.get('/login', passport.authenticate('github'));

/** ************************************************
 * LOGOUT ROUTE
 ************************************************ */
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

module.exports = router;
