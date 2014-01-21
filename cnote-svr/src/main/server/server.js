var express = require('express');
var passport = require('passport');
var path = require('path');
var fs = require('fs');
var http = require('http');
var https = require('https');
var LocalStrategy = require('passport-local').Strategy;

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

passport.use(new LocalStrategy(function(username, password, done) {
  User.findOne({
    username : username
  }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, {
        message : 'Invalid username.'
      });
    }
    if (!user.validPassword(password)) {
      return done(null, false, {
        message : 'Invalid password.'
      });
    }

    return done(null, user);
  });
}));

var app = express();

// app configure
app.use(express.compress());
app.use(express.favicon('public/favicon.ico'));
app.use(express.cookieParser('CNOTESESSION'));
app.use(express.bodyParser());
app.use(passport.initialize());
app.use(passport.session());

// you need this line so the .get etc. routes are run and if an error within,
// then the error is parsed to the ned middleware (your error reporter)
app.use(app.router);
app.use(logErrors);
app.use(clientErrorHandler);

// static files
app.use('/cnote', passport.authenticate('local'), express.static(webapp_root), {
  maxAge : oneDay
});

// REST
app.get('/notes', passport.authenticate('local'), notes.findAll);
app.get('/notes/:id', passport.authenticate('local'), notes.findById);
app.post('/notes', passport.authenticate('local'), notes.add);
app.put('/notes/:id', passport.authenticate('local'), notes.update);


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
