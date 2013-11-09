var express = require('express');

var exp = express();
var notes = require('./js/routes/notes');

exp.get('/notes', notes.findAll);
exp.get('/notes/:id', notes.findById);

exp.listen(8080);
console.log('Listening on port 8080...');