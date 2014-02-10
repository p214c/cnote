var Users = function() {
  var mongoose = require('mongoose');
  var hash = require('../util/hash');

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

   exports.User = mongoose.model('userauths', UserSchema);
};

var instance = new Users();