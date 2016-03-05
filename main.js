var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
var query = require('./rds/queries');
var ldc = require('./models/ldc');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

//LP: changed bodyParser.urlencoded extended from false to true
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getRateTypes',function(req, res){
  query.getRateTypes(function(message) {
      res.send(message);
    });
});

app.get('/getLDCs',function(req,res){
  query.getLDCs(function(message){
    res.send(message);
  });
});

//rate type get calls
app.get('/getRates',function(req,res){
  query.getRates(function(message){
    res.send(message);
  });
});
app.get('/getTiered',function(req,res){
  query.getTieredRates(function(message){
    res.send(message);
  });
});
app.get('/getTimeOfUse',function(req,res){
  query.getTimeOfUseRates(function(message){
    res.send(message);
  });
});

app.put('/addRateType',function(req, res){
  query.addRateType(req.query,function(message) {
      res.send(message);
    });
});

app.put('/addLDC',function(req,res){
  query.addLDC(req.query,function(message){
    res.send(message);
  });
});

//add rate information to the database
app.put('/addRates',function(req,res){
  query.addRates(req.query,function(message){
    res.send(message);
  });
});

app.put('/addTiered',function(req,res){
  query.addTieredRates(req.query,function(message){
    res.send(message);
  });
});

app.put('/addTimeOfUse',function(req, res){
  query.addTimeOfUseRates(req.query,function(message) {
      res.send(message);
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

