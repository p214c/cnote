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

  function clearImmutableNoteFields(data) {
    var clone = _.cloneDeep(data);
    delete clone.id;
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

  function findUserNote(notes, id) {
    notes = notes || [];
    for (var j = 0, jlen = notes.length; j < jlen; j++) {
      if (notes[j]._id.equals(id)) {
        return notes[j];
      }
    }

    return '';
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
        var note = findUserNote(user.notes, request.params.id);

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

  function upsertNoteHandler(request, response) {
    return function queryResult(err, user) {
      if (err) {
        sendErrorResponse(response, err);
      }

      if (user) {
        var note =  findUserNote(user.notes, request.body._id);
        if (note) {
          _.assign(note, clearImmutableFields(request.body));
        } else {}
          var title = request.body.title || 'title-' + user.notes.length;
          note = new createNote(title, request.body.data);
          user.notes.push(note);
        }
      
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

  function upsertNote(req, res) {
    queryUser(req.user.email, upsertNoteHandler(req, res));
  }
  this.upsertNote = upsertNote;

};

var instance = new NotesRoute();

exports.findAll = instance.getNotes;
exports.findById = instance.getNote;
exports.add = instance.upsertNote;
exports.update = instance.upsertNote;
