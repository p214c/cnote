var express = require("express");
var path = require("path");
var notes = require('./routes/notes');

var application_root = __dirname;
var webapp_root = path.join(application_root, '../webapp');
var oneDay = 86400000;

var app = express();

// app configure
app.use(express.compress());
app.use(express.favicon('../webapp/favicon.ico'));
app.use(express.bodyParser());
app.use(express.errorHandler({
  dumpExceptions : true,
  showStack : true
}));

// static files
app.use('/cnote', express.static(webapp_root), {
  maxAge : oneDay
});

// REST
app.get('/notes', notes.findAll);
app.get('/notes/:id', notes.findById);
app.post('/notes', notes.add);
app.put('/notes/:id', notes.update);

app.listen(8080);
console.log('Listening on port 8080...');
