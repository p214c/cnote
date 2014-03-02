var datastore = function() {
  var mongoose = require('mongoose');

  objectId = function() {
    return new mongoose.Types.ObjectId;
  };
  this.objectId = objectId;

};

var instance = new datastore();
exports.DB = instance;
