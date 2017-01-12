"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Db = require('./models/Db');
var app = express();

// Connect to database
Db.connect(function(err) {
  if (err) {
    console.error("Impossible to connect to database, error message is : \n" + err.message);
    process.exit();
  }
  // Everything is okay, let's display something positive
  console.log("Connected to database, have fun !");
  // It's time to launch the app
  launchExpressApp();
});

function launchExpressApp() {
  // view engine setup
  app.set('views', path.join(__dirname, 'public/views'));
  app.set('view engine', 'jade');

  // uncomment after placing your favicon in /public
  //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));

  require('./routes')(app);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.end(err.message);
  });
}

module.exports = app;