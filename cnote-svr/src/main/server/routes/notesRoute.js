var NotesRoute = function() {
  var _ = require('lodash');
  var User = require('../models/user').User;
  var Note = require('../models/note').Note;
  var DB = require('../util/datastore').DB;

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

  function clearImmutableNoteFields(data) {
    var clone = _.cloneDeep(data);
    delete clone._id;
    delete clone.created;
    delete clone['last-modified'];

    return clone;
  }

  function queryUser(email, handler) {
    User.findOne({
      email : email
    }, handler);
    // .populate('notes').exec(handler);
  }

  function queryUserNote(email, id, handler) {
    User.findOne({
      email : email,
      'notes._id' : id || DB.objectId()
    }, handler);
  }

  function getNotesHandler(request, response) {
    return function queryResult(err, user) {
      if (err) {
        sendErrorResponse(response, err);
      } else if (user) {
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

  function getNotes(request, res) {
    try {
      queryUser(request.user.email, getNotesHandler(request, res));
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
  this.getNotes = getNotes;

  function getNoteHandler(request, response, noteId) {
    return function queryResult(err, user) {
      if (err) {
        sendErrorResponse(response, err);
      } else if (user) {
        var note = user.notes.id(noteId);
        response.send(note);
      } else {
        sendErrorResponse(response, 'Unknown user');
      }
    };
  }

  function getNote(request, response) {
    try {
      queryUserNote(request.user.email, request.params.id, getNoteHandler(request, response, request.params.id));
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
  this.getNote = getNote;

  function updateUser(user, note, response) {
    note['last-modified'] = new Date().getTime();

    user.save(function(err, user, numberAffected) {
      if (err) {
        sendErrorResponse(response, err);
      } else {
        response.send(note);
      }
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
  }

  function addNoteHandler(request, response) {
    return function queryResult(err, user) {
      if (err) {
        sendErrorResponse(response, err);
      } else if (user) {
        var title = request.body.title || 'title-' + user.notes.length;
        var note = new createNote(title, request.body.data);
        user.notes.push(note);
        updateUser(user, note, response);
      } else {
        sendErrorResponse(response, 'Unknown user');
      }
    };
  }

  function upsertNoteHandler(request, response, noteId) {
    return function queryResult(err, user) {
      if (err) {
        sendErrorResponse(response, err);
      } else if (user) {
        // user note was found
        var note = user.notes.id(noteId);
        _.assign(note, clearImmutableNoteFields(request.body));
        updateUser(user, note, response);
      } else {
        // didn't find the note for the user get user and add note
        queryUser(request.user.email, addNoteHandler(request, response));
      }
    };
  }

  function upsertNote(request, res) {
    try {
      queryUserNote(request.user.email, request.body._id, upsertNoteHandler(request, res, request.body._id));
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
  this.upsertNote = upsertNote;

  function removeNoteHandler(request, response, noteId) {
    return function queryResult(err, user) {
      if (err) {
        sendErrorResponse(response, err);
      } else if (user) {
        var note = user.notes.id(noteId);
        user.notes.pull(note._id);
        user.save(function(err, numberAffected) {
          if (err) {
            sendErrorResponse(response, err);
          } else if (numberAffected < 1) {
            sendErrorResponse(response, 'Failed to remove note ' + note);
          } else {
            response.status(200).json({
              message : 'Removed note ' + note._id,
              note : note
            });
          }
        });
      } else {
        sendErrorResponse(response, 'Could not find note ' + request.params.noteId);
      }
    };
  }

  function removeNote(request, res) {
    try {
      queryUserNote(request.user.email, request.params.noteId, removeNoteHandler(request, res, request.params.noteId));
    } catch (err) {
      sendErrorResponse(res, err);
    }
  }
  this.removeNote = removeNote;
};

var instance = new NotesRoute();

exports.findAll = instance.getNotes;
exports.findById = instance.getNote;
exports.add = instance.upsertNote;
exports.update = instance.upsertNote;
exports.remove = instance.removeNote;
