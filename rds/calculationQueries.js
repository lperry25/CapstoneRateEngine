var connection = require('./connection');

var calc = {

	ldcID : function (ldcName, rateType, callback){
   connection.query('SELECT id FROM LDC WHERE companyName = "'+ldcName+'" AND rateType = "'+rateType+'"', function(err, rows, fields) {
        if(err) {
          callback(err);
          throw err;
        } else {
	        var returnId = 0;
	        rows.forEach(function(item){
	        	returnId = item.id;
	        });
	        callback(returnId);
    	}
      });
  },	
  regConsumption : function (ldc, timePeriod, callback){
  	//if needed we could pass this HOEPid to the function instead if there where eventually other LDCs with similair rate structures as Ontario
  	var HOEPid = 7;
  	console.log("this is how the time looks " +timePeriod );
 /*  connection.query('SELECT rateAmount FROM Rates WHERE units = "kWh" AND LDCid = '+ldc+
   	' AND endDate IS null OR units = "kWh" AND LDCid = '+HOEPid+' AND startDate = "'+timePeriod+'"', function(err, rows, fields) {
   		*/
   	connection.query('SELECT rateAmount FROM Rates WHERE units = "kWh" AND LDCid = '+ldc+' AND endDate IS null OR units="kWh" AND LDCid =' + HOEPid + ' AND startDate <= "'+timePeriod+'" AND endDate >= "'+timePeriod+'"', function(err, rows, fields) {
        console.log("consumption rows returned "+rows);
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
  ToUConsumption : function (ldc, timeFrame, isWeekend, callback){
    console.log("in the fucking ToU query with this time "+timeFrame);
   connection.query('SELECT rateAmount FROM TimeOfUse WHERE LDCid = '+ldc+' AND startHour <= "'+timeFrame+'" AND endHour >= "'+timeFrame+'" AND isWeekend = '+isWeekend+' AND endDate IS null', function(err, rows, fields) {
        console.log("what is the timeFrame? "+timeFrame);
        console.log("consumption rows returned "+rows);
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
  regDemand : function (ldc, callback){
  	//need to retrieve all the kWh recent rates from the Rates Table
   connection.query('SELECT rateAmount FROM Rates WHERE units = "kW" AND LDCid = '+ldc, function(err, rows, fields) {
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
  fixedCosts : function (ldc, callback){
  	//need to retrieve all the kWh recent rates from the Rates Table
   connection.query('SELECT rateAmount FROM Rates WHERE units = "bill" AND LDCid = '+ldc, function(err, rows, fields) {
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