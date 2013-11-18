var express = require("express");
var path = require("path");
var notes = require('./routes/notes');

var application_root = __dirname;
var webapp_root = path.join(application_root, '../webapp');
var oneDay = 86400000;

function logErrors(err, req, res, next) {
  console.error(err.stack);
  next(err);
}
function clientErrorHandler(err, req, res, next) {
  if (req.xhr) {
    res.send(500, {
      id : -1,
      message : err.message,
      resolution : 'Stop! Drop! and Roll!'
    });
  } else {
    next(err);
  }
}

var app = express();

// app configure
app.use(express.compress());
app.use(express.favicon('../webapp/favicon.ico'));
app.use(express.bodyParser());

// you need this line so the .get etc. routes are run and if an error within,
// then the error is parsed to the ned middleware (your error reporter)
app.use(app.router);
app.use(logErrors);
app.use(clientErrorHandler);

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
