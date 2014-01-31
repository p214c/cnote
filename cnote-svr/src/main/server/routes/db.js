var DB = function() {
  var mongoose = require('mongoose');

  this.Users;
  
  var localUserSchema = new mongoose.Schema({
    username : String,
    salt : String,
    hash : String
  });

  function init() {
    mongoose.connect("mongodb://localhost/cnote");
    Users = mongoose.model('userauths', localUserSchema);
  }
  this.init = init;

};

var instance = new DB();

exports.Users = instance.Users;

exports.init = function() {
  instance.init();
};
