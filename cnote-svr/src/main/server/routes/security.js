var Security = function() {
  var passport = require('passport');
  var LocalStrategy = require('passport-local').Strategy;

  passport.use(new LocalStrategy(function(username, password,done){
    User.findOne({ username : username},function(err,user){
        if(err) { return done(err); }
        if(!user){
            return done(null, false, { message: 'Incorrect username.' });
        }

        hash( password, user.salt, function (err, hash) {
            if (err) { return done(err); }
            if (hash == user.hash) return done(null, user);
            done(null, false, { message: 'Incorrect password.' });
        });
    });
}));  
  function initLocalStrategy() {
    passport.use(new LocalStrategy(function(username, password, done) {
      User.findOne({
        username : username
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {
            message : 'Invalid username.'
          });
        }
        if (!user.validPassword(password)) {
          return done(null, false, {
            message : 'Invalid password.'
          });
        }

        return done(null, user);
      });
    }));
  }

  function authenticate(strategy) {
    return passport.authenticate(strategy);
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

exports.authenticate = function(strategy) {
  return instance.authenticate(strategy);
};