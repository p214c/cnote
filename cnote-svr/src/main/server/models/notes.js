var Notes = function() {
  var mongoose = require('mongoose');

  this.NotesSchema = new mongoose.Schema({
    title : String,
    description : String,
    cabinet : String,
    drawer : String,
    data : String,
    keywords : String,
    created : Date,
    'last-modified' : Date
  });

//  var NotesModel = mongoose.model('notes', NotesSchema);
  
};

var instance = new Notes();
exports.Notes = instance;