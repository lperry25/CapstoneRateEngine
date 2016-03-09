var connection = require('./connection');
var ldc = require('../models/database/ldc');


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
  getRateTypesFromLDC : function(city, ldc, callback) {
	var rateList = [];
	//delete switch statement and use query instead to populate rateList
	//then callback passing rateList
	switch(ldc) {
		case "London Hydro":
			rateList = [{rateType: "Spot Market"}, {rateType: "Tiered"}, {rateType: "Time of Use"}];
			break;
		case "Big Apple Power":
			rateList = [{rateType: "Tiered"}, {rateType: "Time of Use"}];
			break;
		case "Company 1":
			rateList = [{rateType: "Time of Use"}];
			break;
		default:
			rateList = [{rateType: "Default"}];
	}
	callback(rateList);  
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
        console.log(rows);
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
	var countryList = [{country: "Canada"}, {country: "China"}, {country: "United States"}];
	callback(countryList);
  },
  //grab all cities located in a given country
  getCitiesInCountry : function(country, callback) {
	var cityList = [];
	//delete switch statement and use query instead to populate cityList
	//then callback passing cityList
	switch(country) {
		case "Canada":
			cityList = [{city: "Calgary"}, {city: "Kingston"}, {city: "London"}, {city: "Sarnia"}];
			break;
		case "China":
			cityList = [{city: "Beijing"}, {city: "Shanghai"}];
			break;
		case "United States":
			cityList = [{city: "Chicago"}, {city: "Houston"}, {city: "New York"}];
			break;
		default:
			cityList = [{city: "Default"}];
	}
	callback(cityList);
  },
  //get all LDCs located in a given city
  getLDCsInCity : function(city, callback) {
	var ldcList = [];
	//delete switch statement and use query instead to populate ldcList
	//then callback passing ldcList
	switch(city) {
		case "London":
			ldcList = [{companyName: "London Hydro"}];
			break;
		case "New York":
			ldcList = [{companyName: "NY Power"}, {companyName: "Big Apple Power"}];
			break;
		case "Shanghai":
			ldcList = [{companyName: "Company 1"}, {companyName: "Company 2"}, {companyName: "Company 3"}];
			break;
		default:
			ldcList = [{companyName: "Default"}];
	}
	callback(ldcList);
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
