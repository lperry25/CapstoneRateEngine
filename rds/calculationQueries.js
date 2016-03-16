var connection = require('./connection');

var calc = {

	ldcID : function (callback,ldc){
  	//need to retrieve all the kWh recent rates from the Rates Table
   connection.query('SELECT id FROM LDC WHERE companyName ="'+ldc,'"', function(err, rows, fields) {
        console.log(rows);
        if(err) {
          callback(err);
          throw err;
        } else {
        	var rateAmountSum = 0;
        	rows.forEach(function(item){
        		rateAmountSum = rateAmountSum + item.rateAmount;
        	});
          callback(rateAmountSum);
        }
      });
  },	
  regConsumption : function (callback){
  	//need to retrieve all the kWh recent rates from the Rates Table
   connection.query('SELECT rateAmount FROM Rates WHERE units = "kWh"', function(err, rows, fields) {
        console.log(rows);
        if(err) {
          callback(err);
          throw err;
        } else {
        	var rateAmountSum = 0;
        	rows.forEach(function(item){
        		rateAmountSum = rateAmountSum + item.rateAmount;
        	});
          callback(rateAmountSum);
        }
      });
  },
  regDemand : function (callback){
  	//need to retrieve all the kWh recent rates from the Rates Table
   connection.query('SELECT rateAmount FROM Rates WHERE units = "kW" ', function(err, rows, fields) {
        console.log(rows);
        if(err) {
          callback(err);
          throw err;
        } else {
        	var rateAmountSum = 0;
        	rows.forEach(function(item){
        		rateAmountSum = rateAmountSum + item.rateAmount;
        	});
          callback(rateAmountSum);
        }
      });
  },
  fixedCosts : function (callback){
  	//need to retrieve all the kWh recent rates from the Rates Table
   connection.query('SELECT rateAmount FROM Rates WHERE units = "fixed" ', function(err, rows, fields) {
        console.log(rows);
        if(err) {
          callback(err);
          throw err;
        } else {
        	var rateAmountSum = 0;
        	rows.forEach(function(item){
        		rateAmountSum = rateAmountSum + item.rateAmount;
        	});
          callback(rateAmountSum);
        }
      });
  }
};


// Export all functions.
module.exports = calc;