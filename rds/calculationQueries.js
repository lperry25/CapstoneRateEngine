var connection = require('./connection');

var calc = {
  regConsumption : function (callback){
  	//need to retrieve all the kWh recent rates from the Rates Table
   connection.query('SELECT rateAmount FROM Rates', function(err, rows, fields) {
        console.log(rows);
        if(err) {
          callback(err);
          throw err;
        } else {
        	var rateAmountSum = 0;
        	console.log("the value returned from databse : " + rows);
        	rows.forEach(function(item){
        		console.log('the rateAmount in row' + item.rateAmount);
        		rateAmountSum = rateAmountSum + item.rateAmount;
        	});
          callback(rateAmountSum);
        }
      });
  },
  regDemand : function (callback){
  	//need to retrieve all the kWh recent rates from the Rates Table
   connection.query('SELECT rateAmount FROM Rates', function(err, rows, fields) {
        console.log(rows);
        if(err) {
          callback(err);
          throw err;
        } else {
        	var rateAmountSum = 0;
        	console.log("the value returned from databse : " + rows);
        	rows.forEach(function(item){
        		console.log('the rateAmount in row' + item.rateAmount);
        		rateAmountSum = rateAmountSum + item.rateAmount;
        	});
          callback(rateAmountSum);
        }
      });
  }
};


// Export all functions.
module.exports = calc;