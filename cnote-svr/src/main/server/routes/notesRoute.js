var NotesRoute = function() {
  var _ = require('lodash');
  var User = require('../models/users').User;

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

    return data;
  }

  function getNotes(req, res) {
    User.findOne({
      email : req.user.email
    }, function(err, user) {
      if (err) {
        throw err;
      }

      if (user) {
        var ns = user.notes;
        if (req.query.ids) {
          // only return the id and title
          var nsIds = [];
          for (var j = 0, jlen = ns.length; j < jlen; j++) {
            nsIds.push({
              id : ns[j]._id,
              title : ns[j].title
            });
          }

          ns = nsIds;
        }

        res.send(ns);
      } else {
        throw $.error('Unknown user.');
      }
    });
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
    n.title += "-" + (notes.length + 1);
    _.assign(n, clearImmutableFields(data));

    notes.push(n);

    return n;
  }
  this.addNote = addNote;

  function updateNote(id, data) {
    var n = notes[id - 1];
    if (n) {
      _.assign(n, clearImmutableFields(data));
      n['last-modified'] = new Date().getTime();
    }

    return n;
  }
  this.updateNote = updateNote;

};

var instance = new NotesRoute();

exports.findAll = instance.getNotes;

exports.findById = function(req, res) {
  res.send(instance.getNote(req.params.id));
};

exports.add = function(req, res) {
  res.send(instance.addNote(req.body));
};

exports.update = function(req, res) {
  res.send(instance.updateNote(req.params.id, req.body));
};
