var Note = function() {
  var mongoose = require('mongoose');

  this.NoteSchema = new mongoose.Schema({
    title : String,
    description : String,
    cabinet : String,
    drawer : String,
    data : String,
    keywords : String,
    created : {
      type : Date,
      'default' : Date.now
    },
    'last-modified' : Date
  });

  exports.Note = mongoose.model('note', this.NoteSchema);

};

var instance = new Note();
exports.NoteSchema = instance.NoteSchema;
