var express = require('express');
var db = require('./models/models');

// Require middleware
var parser = require('body-parser');
var morgan = require('morgan');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var jwt = require('jwt-simple');
var cookieParser = require('cookie-parser');

// Router
var router = require('./config/routes.js');

// Set up server
var app = express();

// Set port and listen
var port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('Listening on port:'+port);
});

// Logging and parsing
app.use(morgan('dev'));
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up routes
app.use('/api', router);

// Serve client files
app.use(express.static(__dirname + '/../client'));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/***** FACEBOOK AUTH *****/
var User = db.User;
var FACEBOOK_APP_ID = '553060631520944';
var FACEBOOK_APP_SECRET = '6d6d7fe25752c6bb43490d4d915f42af';

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName','email', 'cover']
  },
  function(accessToken, refreshToken, profile, cb) {
    process.nextTick(function() {

      User.findOrCreate({ where:{
        facebookID: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value
      }})
        .spread(function (user, created) {
          return cb(null, user);
      });
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook', {scope: 'email'}));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/signin' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.cookie('userID', req.user.id);
    res.cookie('facebookID', req.user.facebookID);
    res.cookie('displayName', req.user.displayName);
    res.cookie('email', req.user.email);

    res.redirect('/');
  });

module.exports.app = app;