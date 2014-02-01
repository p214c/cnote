// this file is used to seed the mongodb database with users out of band from the running web server
var mongoose = require('mongoose');
var hash = require('./util/hash');

function addUser(User, email, firstName, lastName, password) {

  hash(password, function(err, salt, hash) {
    if (err)
      throw err;
    // if (err) return done(err);

    User.findOne({
      email : email
    }, function(err, user) {
      if (err)
        throw err;

      if (user) {
        // user exists, update
        user.firstName = firstName;
        user.lastName = lastName;
        user.salt = salt;
        user.hash = hash;

        user.save(function(err, user) {
          if (err)
            throw err;

          console.log('Updated user ' + user.email);
          // done(null, user);
        });
      } else {
        // create new user
        user = {
          email : email,
          firstName : firstName,
          lastName : lastName,
          salt : salt,
          hash : hash
        };

        User.create(user, function(err, user) {
          if (err)
            throw err;
          // if (err) return done(err);
          console.log('Added user ' + user.email);
          // done(null, user);
        });
      }
    });
  });
};

function addUsers(User) {
  var users = [ {
    email : "user1@xeped.com",
    firstName : "user one",
    lastName : "cnote",
    password : "cn0t3 1"
  }, {
    email : "user2@xeped.com",
    firstName : "user two",
    lastName : "cnote",
    password : "cn0t3 2"
  }, {
    email : "user3@xeped.com",
    firstName : "user three",
    lastName : "cnote",
    password : "cn0t3 3"
  } ];

  console.log('adding ' + users.length + ' users');
  for (var i = 0, len = users.length; i < len; i++) {
    addUser(User, users[i].email, users[i].firstName, users[i].lastName, users[i].password);
  }
}

var UserSchema = new mongoose.Schema({
  firstName : String,
  lastName : String,
  email : String,
  salt : String,
  hash : String
});

console.log('connecting to cnote collection');
mongoose.connect("mongodb://localhost/cnote");
var User = mongoose.model('userauths', UserSchema);
addUsers(User);
console.log('complete');
