var Users = function() {
  var mongoose = require('mongoose');
  var hash = require('../util/hash');

  this.User;

  var UserSchema = new mongoose.Schema({
    firstName : String,
    lastName : String,
    email : String,
    salt : String,
    hash : String
  // facebook:{
  // id: String,
  // email: String,
  // name: String
  // },
  // google:{
  // id: String,
  // email: String,
  // name: String
  // }
  });

  UserSchema.statics.isValidUserPassword = function(email, password, done) {
    this.findOne({
      email : email
    }, function(err, user) {
      // if(err) throw err;
      if (err)
        return done(err);
      if (!user)
        return done(null, false, {
          message : 'Invalid email.'
        });
      hash(password, user.salt, function(err, hash) {
        if (err)
          return done(err);
        if (hash == user.hash)
          return done(null, user);
        done(null, false, {
          message : 'Invalid password'
        });
      });
    });
  };

  function init() {
    mongoose.connect("mongodb://localhost/cnote");
    User = mongoose.model('userauths', UserSchema);
  }
  this.init = init;

};

var instance = new Users();

exports.User = instance.User;

exports.init = function() {
  instance.init();
};
