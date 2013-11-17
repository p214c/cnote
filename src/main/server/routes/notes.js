var Note = function() {
  var _ = require('lodash');

  var notes = [];

  var note = function(id) {
    var d = new Date();

    this.id = id;
    this.title = 'title';
    this.description = 'description';
    this.cabinet = 'cabinet';
    this.drawer = 'drawer';
    this.data = 'data';
    this.keywords = 'keywords';
    this.created = d.getTime();
    this['last-modified'] = d.getTime();
  };

  function clearImmutableFields(data) {
    delete data.id;
    delete data.created;
    delete data['last-modified'];
  }

  function getNotes() {
    return notes;
  }
  this.getNotes = getNotes;

  function getNote(id) {
    if (!id) {
      return '';
    }
    return notes[id - 1];
  }
  this.getNote = getNote;

  function addNote(data) {
    var n = new note(notes.length + 1);
    _.assign(n, clearImmutableFields(data));

    notes.push(n);

    return n;
  }
  this.addNote = addNote;

  function updateNote(id, data) {
    var n = notes[id-1];
    if (n) {
      _.assign(n, clearImmutableFields(data));
      n['last-modified'] = new Date().getTime();
    }
    
    return n;
  }
  this.updateNote = updateNote;

};

var instance = new Note();

exports.findAll = function(req, res) {
  res.send(instance.getNotes());
};

exports.findById = function(req, res) {
  res.send(instance.getNote(req.params.id));
};

exports.add = function(req, res) {
  res.send(instance.addNote(req.body));
};

exports.update = function(req, res) {
  res.send(instance.updateNote(req.params.id, req.body));
};