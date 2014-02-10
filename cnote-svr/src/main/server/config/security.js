var Security = function() {
  var User = require('../models/users').User;
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  function initLocalStrategy() {
    // passport.use(new LocalStrategy(function(username, password, done) {
    // db.Users.findOne({
    // username : username
    // }, function(err, user) {
    // if (err) {
    // return done(err);
    // }
    // if (!user) {
    // return done(null, false, {
    // message : 'Invalid username.'
    // });
    // }

    // hash(password, user.salt, function(err, hash) {
    // if (err) {
    // return done(err);
    // }
    // if (hash == user.hash)
    // return done(null, user);
    // done(null, false, {
    // message : 'Invalid password.'
    // });
    // });
    //
    // return done(null, user);
    // });
    // }));

    passport.serializeUser(function(user, done) {
      done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
      User.findOne({
        _id : id
      }, function(err, user) {
        done(err, user);
      });
    });

    passport.use(new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password'
    }, function(email, password, done) {
      User.isValidUserPassword(email, password, done);
    }));
  }

  function authenticate(strategy, callbacks) {
    return passport.authenticate(strategy, callbacks);
  }
  this.authenticate = authenticate;

  function init(app) {
    initLocalStrategy();
    app.use(passport.initialize());
    app.use(passport.session());
  }
  this.init = init;

};

var instance = new Security();

exports.init = function(app) {
  instance.init(app);
};

exports.authenticate = function(strategy, callbacks) {
  return instance.authenticate(strategy, callbacks);
};

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401);
    res.render('login.jade', {title: 'Welcome, please sign in', url: req.url });  }
};
