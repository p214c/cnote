var express = require("express");
var path = require("path");
var fs = require('fs');
var http = require('http');
var https = require('https');

var notes = require('./routes/notes');

var application_root = __dirname;
var webapp_root = path.join(application_root, 'public');
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
app.use(express.favicon('public/favicon.ico'));
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

// self signed cert and key generated with openssl -
// http://stackoverflow.com/questions/10175812/how-to-build-a-self-signed-certificate-with-openssl
// openssl req -x509 -newkey -nodes rsa:2048 -keyout key.pem -out cert.pem -days XXX
var privateKey = fs.readFileSync('sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync('sslcert/cert.pem', 'utf8');
var credentials = {
  key : privateKey,
  cert : certificate
};
// var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

// httpServer.listen(8080);
httpsServer.listen(8443);
console.log('Listening on port 8443...');