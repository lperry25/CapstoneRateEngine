var connection = require('./connection');
var ldc = require('../models/database/ldc');


var query = {
  getRateTypes : function (callback){
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('SELECT * FROM RateTypes', function(err, rows, fields) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            callback(rows);
          }
        });
      }
    });
  },
  //get the rateTypes that a given LDC offers in a given city (need city in case LDC operates in more than one location)
  getRateTypesFromLDC : function( ldc, callback) {
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('SELECT rateType FROM LDC WHERE companyName = "'+ldc+'"', function(err, rows, fields) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            callback(rows);
          }
        });
      }
    });
  },
  addRateType : function (post,callback){
    console.log(post);
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('INSERT INTO RateTypes SET ?',post, function(err, rows, fields) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            console.log(rows.insertId);
            callback(rows);
          }
        });
      }
    });
  },
  getRates : function (callback){
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('SELECT * FROM Rates', function(err, rows, fields) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            callback(rows);
          }
        });
      }
    });
  },
  addRates : function (body,callback){
    //Need to make sure the date is entered properly into the database
    console.log(body);
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('INSERT INTO Rates SET ?',{LDCid: body.LDCid, rateName: body.rateName, startDate: body.startDate, endDate: body.endDate, units: body.units, rateAmount: body.rateAmount}, function(err, results) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            console.log(results.insertId);
            callback(results.insertId);
          }
        });
      }
    });
  },
  getTieredRates : function (callback){
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
       connection.query('SELECT * FROM Tiered', function(err, rows, fields) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            callback(rows);
          }
        });
      }
    });
  },
  addTieredRates : function (post,callback){
    //Need to make sure the date is entered properly into the database
    console.log(post);
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('INSERT INTO Tiered SET ?',post, function(err, rows, fields) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            console.log(rows.insertId);
            callback(rows);
          }
        });
      }
    });
  },
  getTimeOfUseRates : function (callback){
    connection.getConnection(function(err, connection) {
      if(err) {
        console(err);
        throw err;
      } else {
       connection.query('SELECT * FROM TimeOfUse', function(err, rows, fields) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            callback(rows);
          }
        });
      };
    });
  },
  addTimeOfUseRates : function (body,callback){
    //Need to make sure the date is entered properly into the database
    console.log(body);
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('INSERT INTO TimeOfUse SET ?',{LDCid: body.LDCid, rateName: body.rateName, startDate: body.startDate, endDate: body.endDate, peakLevel: body.peakLevel, startHour: body.startHour, endHour: body.endHour, units: body.units, rateAmount: body.rateAmount, isWeekend: body.isWeekend}, function(err, results) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            console.log(results.insertId);
            callback(results.insertId);
          }
        });
      }
    });
  },
  getLDCs : function (callback){
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('SELECT * FROM LDC', function(err, rows, fields) {
          console.log(rows);
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            callback(rows);
          }
        });
      }
    });
  },
  //grab all the countries that LDCs are located in
  getLDCCountries : function(callback) {
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('SELECT DISTINCT country FROM LDC WHERE companyName != "HOEP"', function(err, rows, fields) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            callback(rows);
          }
        });
      }
    });
  },
  //grab all cities located in a given country
  getCitiesInCountry : function(country, callback) {
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('SELECT DISTINCT city FROM LDC WHERE country = "'+country+'"', function(err, rows, fields) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            callback(rows);
          }
        });
      }
    });
  },
  //get all LDCs located in a given city
  getLDCsInCity : function(city, callback) {
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('SELECT DISTINCT companyName FROM LDC WHERE city = "'+city+'"', function(err, rows, fields) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            callback(rows);
          }
        });
      }
    });
  },
  addLDC : function (body,callback){
    console.log(body);
    //var post = {companyName: ldc.companyName ,country: ldc.country ,city: ldc.city ,rateType: ldc.rateType};
    connection.getConnection(function(err, connection) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        connection.query('INSERT INTO LDC SET ?',{companyName: body.companyName, country: body.country, city: body.city, rateType: body.rateType}, function(err, result) {
          if(err) {
            console.log(err);
            throw err;
          } else {
            connection.release();
            console.log(result.insertId);
            callback(result.insertId);
          }
        });
      }
    });
  }
};

// Export all functions.
module.exports = query;
