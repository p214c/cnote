var Note = function() {
  var _ = require('lodash');

  var notes = [ {
    name : 'note 1'
  }, {
    name : 'note 2'
  } ];

  var note = {
    name : "a name",
    description : "a description"
  };

  function getNotes() {
    return notes;
  }
  this.getNotes = getNotes;

  function getNote(id) {
    var n = _.clone(note);
    n.id = id;
    notes.push(n);
    return n;
  }
  this.getNote = getNote;
};

var instance = new Note();

exports.findAll = function(req, res) {
  res.send(instance.getNotes());
};

exports.findById = function(req, res) {
  res.send(instance.getNote(req.params.id));
};