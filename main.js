var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
var query = require('./rds/queries');
var ldc = require('./models/database/ldc');
var RateEngine = require('./models/rateEngine');

//can most likely delete later. used for testing
var calc = require('./rds/calculationQueries');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//rate calculation calls
var rateEngine = new RateEngine();

app.put('/calculateCost',function(req,res){
  console.log(req.body.consumption);
  rateEngine.calculateCost(req.body, function(message) {
      console.log("Back to main");
      res.send(message);
      console.log("message sent");
      res.end();
  });
});

//database calls

app.get('/getRateTypes',function(req, res){
  console.log(req.body);
  query.getRateTypes(function(message) {
      res.send(message);
    });
});

app.get('/getLDCs',function(req,res){
  query.getLDCs(function(message){
    res.send(message);
  });
});

//This request is to get all the countries that LDCs are located in
app.get('/getLDCCountries', function(req, res) {
	query.getLDCCountries(function(countryList) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.send(countryList);
	});
});

//This request is to get all the cities in a given country
app.get('/getCitiesInCountry', function(req, res) {
	query.getCitiesInCountry(req.query.country, function(cityList) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.send(cityList);
	});
});

//This request is to get all the LDCs in a given city
app.get('/getLDCsInCity', function(req, res) {
	query.getLDCsInCity(req.query.city, function(ldcList) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.send(ldcList);
	});
});

//This request is to get all the rate types at a given LDC in a given city
app.get('/getRateTypesFromLDC', function(req, res) {
	query.getRateTypesFromLDC(req.query.ldc, function(rateList) {
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.send(rateList);
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

