var connection = require('./connection');
var ldc = require('../models/ldc');


var query = {
  getRateTypes : function (callback){
   connection.query('SELECT * FROM RateTypes', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          callback(rows);
        }
      });
  },
  //get the rateTypes that a given LDC offers in a given city (need city in case LDC operates in more than one location)
  getRateTypesFromLDC : function( ldc, callback) {
    connection.query('SELECT rateType FROM LDC WHERE companyName = "'+ldc+'"', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          callback(rows);
        }
      });
  },
  addRateType : function (post,callback){
    console.log(post);
    connection.query('INSERT INTO RateTypes SET ?',post, function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          console.log(rows.insertId);
          callback(rows);
        }
      });
  },
  getRates : function (callback){
   connection.query('SELECT * FROM Rates', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          callback(rows);
        }
      });
  },
  addRates : function (post,callback){
    //Need to make sure the date is entered properly into the database
    console.log(post);
    connection.query('INSERT INTO Rates SET ?',post, function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          console.log(rows.insertId);
          callback(rows);
        }
      });
  },
  getTieredRates : function (callback){
   connection.query('SELECT * FROM Tiered', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          callback(rows);
        }
      });
  },
  addTieredRates : function (post,callback){
    //Need to make sure the date is entered properly into the database
    console.log(post);
    connection.query('INSERT INTO Tiered SET ?',post, function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          console.log(rows.insertId);
          callback(rows);
        }
      });
  },
  getTimeOfUseRates : function (callback){
   connection.query('SELECT * FROM TimeOfUse', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          callback(rows);
        }
      });
  },
  addTimeOfUseRates : function (post,callback){
    //Need to make sure the date is entered properly into the database
    console.log(post);
    connection.query('INSERT INTO TimeOfUse SET ?',post, function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          console.log(rows.insertId);
          callback(rows);
        }
      });
  },
  getLDCs : function (callback){
   connection.query('SELECT * FROM LDC', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          callback(rows);
        }
      });
  },
  //grab all the countries that LDCs are located in
  getLDCCountries : function(callback) {
    connection.query('SELECT DISTINCT country FROM LDC', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          callback(rows);
        }
      });
  },
  //grab all cities located in a given country
  getCitiesInCountry : function(country, callback) {
    connection.query('SELECT DISTINCT city FROM LDC WHERE country = "'+country+'"', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          callback(rows);
        }
      });
  },
  //get all LDCs located in a given city
  getLDCsInCity : function(city, callback) {
    connection.query('SELECT DISTINCT companyName FROM LDC WHERE city = "'+city+'"', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          callback(rows);
        }
      });
  },
  addLDC : function (post,callback){
    console.log(post);
    //var post = {companyName: ldc.companyName ,country: ldc.country ,city: ldc.city ,rateType: ldc.rateType};
    connection.query('INSERT INTO LDC SET ?',post, function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          console.log(rows.insertId);
          callback(rows);
        }
      });
  }
};

// Export all functions.
module.exports = query;
