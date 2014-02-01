var Security = function() {
  var dbUsers = require('../models/users');
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
      dbUsers.User.findOne({
        _id : id
      }, function(err, user) {
        done(err, user);
      });
    });

    passport.use(new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password'
    }, function(email, password, done) {
      dbUsers.User.isValidUserPassword(email, password, done);
    }));
  }

  function authenticate(strategy, callbacks) {
    return passport.authenticate(strategy, callbacks);
  }
  this.authenticate = authenticate;

  function init(app) {
    dbUsers.init();
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
    res.render('login.jade', {title: '401: Unauthorized', url: req.url });  }
};
