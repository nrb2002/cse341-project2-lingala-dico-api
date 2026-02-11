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
router.get(
  //#swagger.tags=["Session & Authentication Endpoints"]
  '/login', 
  passport.authenticate('github')
);

/** ************************************************
 * LOGOUT ROUTE
 ************************************************ */
router.get('/logout', (req, res, next) => {
  //#swagger.tags=["Session & Authentication Endpoints"]
  req.logout(err => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

module.exports = router;
