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
const { mongoDB } = require('./db/connect');

/** *******************************************
 *  ROUTE IMPORTS
 ********************************************/
const index = require('./routes/index');
const wordsRoutes = require('./routes/wordsRoutes');
const swaggerRoutes = require('./routes/swaggerRoutes');
const errorHandler = require('./middleware/errorHandler');

/** *******************************************
 *  ENVIRONMENT VARIABLE
 ********************************************/
const PORT = process.env.PORT || 3000;

/** *******************************************
 *  EXPRESS APP CALL
 ********************************************/
const app = express();

/** *******************************************
 *  MIDDLEWARES USE
 ********************************************/
//Express middlewares
app
  .use(express.json())
  .use(bodyParser.json())
  .use(session({
    secret:"secret",
    resave: false,
    saveUninitialized: true
  }))
  .use(passport.initialize()) //session initialization
  .use(passport.session()) //include passport in every route call
  .use(cors({
    methods:['GET','POST','DELETE','UDPATE','PUT','PATCH']    
  }))
  .use(cors({origin: '*'}))

//Passport object
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    (accessToken, refreshToken, profile, done) => {
      // In a real app, you'd save/find user in DB here
      return done(null, profile);
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
  

/** *******************************************
 *  ROUTES CALL
 ********************************************/
app.get('/', (req, res) => {
      res.send(req.session.use !== undefined? `Logged in as ${req.session.user.displayName}` : "Logged out! ")
    });

app.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/v1/api-docs' }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);


app
  .use('/', index)
  .use('/v1/words', wordsRoutes)
  .use('/v1/api-docs', swaggerRoutes)



/** *******************************************
 *  ERROR HANDLER
 ********************************************/
app.use(errorHandler);

/** *******************************************
 *  SERVER LAUNCHING
 ********************************************/
// Connect to MongoDB and start server
mongoDB()
  .then(() => {
    console.log('MongoDB connected, starting server...');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1); // exit if DB fails
  });
