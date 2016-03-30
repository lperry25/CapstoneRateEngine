var connection = require('./connection');

var calc = {

	ldcID : function (ldcName, rateType, callback){
    connection.getConnection(function(err, connection) {
   connection.query('SELECT id FROM LDC WHERE companyName = "'+ldcName+'" AND rateType = "'+rateType+'"', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
	        var returnId = 0;
	        rows.forEach(function(item){
	        	returnId = item.id;
	        });
                connection.release();
	        callback(returnId);
    	}
      });
    });
  },	
  regConsumption : function (ldc, timePeriod, HOEPid, callback){
    connection.getConnection(function(err, connection) {
   	connection.query('SELECT rateAmount FROM Rates WHERE units = "kWh" AND LDCid = '+ldc+' AND endDate IS null OR units="kWh" AND LDCid =' + HOEPid + ' AND startDate <= "'+timePeriod+'" AND endDate >= "'+timePeriod+'"', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          
        	var rateAmountSum = 0;
        	rows.forEach(function(item){
        		rateAmountSum = rateAmountSum + item.rateAmount;
        	});
                connection.release();
          callback(rateAmountSum);
        }
      });
    });
  },
  ToUConsumption : function (ldc, timeFrame, isWeekend, callback){
    connection.getConnection(function(err, connection) {
    connection.query('SELECT rateAmount FROM TimeOfUse WHERE LDCid = '+ldc+' AND startHour <= "'+timeFrame+'" AND endHour >= "'+timeFrame+'" AND isWeekend = '+isWeekend+' AND endDate IS null', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
          
        	var rateAmountSum = 0;
        	rows.forEach(function(item){
        		rateAmountSum = rateAmountSum + item.rateAmount;
        	});
                connection.release();
          callback(rateAmountSum);
        }
      });
    });
  },
  regDemand : function (ldc, callback){
  	//need to retrieve all the kWh recent rates from the Rates Table
    connection.getConnection(function(err, connection) {
   connection.query('SELECT rateAmount FROM Rates WHERE units = "kW" AND LDCid = '+ldc+' AND endDate IS null', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
        	var rateAmountSum = 0;
        	rows.forEach(function(item){
        		rateAmountSum = rateAmountSum + item.rateAmount;
        	});
                connection.release();
          callback(rateAmountSum);
        }
      });
    });
  },
  fixedCosts : function (ldc, callback){
  	//need to retrieve all the kWh recent rates from the Rates Table
    connection.getConnection(function(err, connection) {
   connection.query('SELECT rateAmount FROM Rates WHERE units = "bill" AND LDCid = '+ldc, function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
        	var rateAmountSum = 0;
        	rows.forEach(function(item){
        		rateAmountSum = rateAmountSum + item.rateAmount;
        	});
                connection.release();
          callback(rateAmountSum);
        }
      });
    });
  }
};


// Export all functions.
module.exports = calc;
