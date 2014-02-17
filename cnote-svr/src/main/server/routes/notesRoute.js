var NotesRoute = function() {
  var _ = require('lodash');
  var User = require('../models/user').User;
  var Note = require('../models/note').Note;

  function createNote(title, data) {
    var d = new Date();
    var note = new Note({
      title : title,
      data : data,
      'last-modified' : d.getTime()
    });
    return note;
  }

  function sendErrorResponse(response, err) {
    response.status(500).json({
      message : 'Internal error',
      error : err
    });
  }

  function queryUser(email, handler) {
    User.findOne({
      email : email
    }, handler);
    // .populate('notes').exec(handler);

  }

  function getNotesHandler(request, response) {
    return function queryResult(err, user) {
      if (err) {
        sendErrorResponse(response, err);
      }

      if (user) {
        var ns = user.notes;
        if (request.query.ids) {
          // only return the id and title
          var nsIds = new Array();
          for (var j = 0, jlen = ns.length; j < jlen; j++) {
            nsIds.push({
              id : ns[j]._id,
              title : ns[j].title
            });
          }

          ns = nsIds;
        }

        response.send(ns);
      } else {
        sendErrorResponse(response, 'Unknown user');
      }
    };
  }

  function getNotes(req, res) {
    queryUser(req.user.email, getNotesHandler(req, res));
  }
  this.getNotes = getNotes;

  function getNoteHandler(request, response) {
    return function queryResult(err, user) {
      if (err) {
        sendErrorResponse(response, err);
      }

      if (user) {
        // TODO query by user and note id instead of iterating the return set
        var note = '';
        var ns = user.notes;
        for (var j = 0, jlen = ns.length; j < jlen; j++) {
          if (ns[j]._id.equals(request.params.id)) {
            note = ns[j];
            break;
          }
        }

        response.send(note);
      } else {
        sendErrorResponse(response, 'Unknown user');
      }
    };
  }

  function getNote(req, res) {
    queryUser(req.user.email, getNoteHandler(req, res));
  }
  this.getNote = getNote;

  function addNoteHandler(request, response) {
    return function queryResult(err, user) {
      if (err) {
        sendErrorResponse(response, err);
      }

      if (user) {
        var note = new createNote('title-' + user.notes.length, request.body);
        user.notes.push(note);
        user.save(function(err, user, numberAffected) {
          if (err) {
            sendErrorResponse(response, err);
          }
          response.send(note);
        });
        // User.update({
        // _id : user._id
        // }, {
        // $push : {
        // notes : note
        // }
        // }, {
        // upsert : true
        // }, function(err, numberAffected, data) {
        // if (err) {
        // sendErrorResponse(response, err);
        // }
        // response.send(data);
        // });
      } else {
        sendErrorResponse(response, 'Unknown user');
      }
    };
  }

  function addNote(req, res) {
    queryUser(req.user.email, addNoteHandler(req, res));
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
exports.findById = instance.getNote;
exports.add = instance.addNote;
exports.update = instance.updateNote;
//
// function(req, res) {
// res.send(instance.updateNote(req.params.id, req.body));
// };

