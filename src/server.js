require('dotenv').config();

/** *******************************************
 *  LIBRARY IMPORTS
 ********************************************/
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const GitHubStrategy = require('passport-github2').Strategy;

/** *******************************************
 *  DB CONNECTION IMPORT
 ********************************************/
const { connectDB } = require('./db/connect');

/** *******************************************
 *  ROUTE IMPORTS
 ********************************************/
const index = require('./routes/index');
const wordsRoutes = require('./routes/wordsRoutes');
const submissionsRoutes = require('./routes/submissionsRoutes');
const swaggerRoutes = require('./routes/swaggerRoutes');
const errorHandler = require('./middleware/errorHandler');

/** *******************************************
 *  ENVIRONMENT VARIABLES
 ********************************************/
const PORT = process.env.PORT || 3000;

/** *******************************************
 *  EXPRESS APP CALL
 ********************************************/
const app = express();

/** *******************************************
 *  MIDDLEWARES
 ********************************************/
app.use(express.json());
app.use(bodyParser.json());
app.use(cors({ origin: '*', methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'] }));

// Session + Passport
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

/** *******************************************
 *  PASSPORT GITHUB STRATEGY
 ********************************************/
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  (accessToken, refreshToken, profile, done) => {
    // Normally you would store/find user in DB here
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

/** *******************************************
 *  HOME & GITHUB CALLBACK ROUTES
 ********************************************/
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Logged in as ${req.user.displayName}`);
  } else {
    res.send('Logged out!');
  }
});

app.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/v1/api-docs' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

/** *******************************************
 *  API ROUTES
 ********************************************/
app.use('/v1', index); // optional aggregated routes
app.use('/v1/words', wordsRoutes); // public + admin words endpoints
app.use('/v1/submissions', submissionsRoutes); // contributors + moderators
app.use('/v1/api-docs', swaggerRoutes); // Swagger UI

/** *******************************************
 *  ERROR HANDLER
 ********************************************/
app.use(errorHandler);

/** *******************************************
 *  START SERVER
 ********************************************/
connectDB()
  .then(() => {
    console.log('MongoDB connected, starting server...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
  });
