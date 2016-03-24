
var Consumption = require( './consumption' );
var Demand = require( './demand' );
var PricingModel = require( './pricingModel' );
<<<<<<< HEAD
var Cost = require('./cost' );
=======
var DemandSum = require( './demandSum' );
var Cost = require('./cost' );
var TieredRateEngine = require( './tieredRateEngine' );
var TimeOfUseRateEngine = require( './timeOfUseRateEngine' );
>>>>>>> master
var dbCalculations = require( '../rds/calculationQueries');


//attributes
var consumptionCost  = new Array();
var consumption      = new Array();
var demand           = new Array();
var demandCost       = new Array();
var fixedCost        = new Array();
var totalCost        = new Array();
var pricingModel     = new PricingModel();
var ldcID            = 0;
var isCommercial     = 0;


var RateEngine = function() {
  /* ===== RateEngine Fields ===== */
  this.pricingModel    = new PricingModel();
  this.demandCost      = [];
  this.totalCost       = [];
};


  /* ===== RateEngine methods ===== */
RateEngine.prototype.calculateCost = function(body,callback) {
	console.log("calculateCost");
	//start by clearing all the variables used
	consumption = new Array();
	consumptionCost = new Array();
	demand = new Array();
	demandCost = new Array();
	fixedCost = new Array();
	totalCost = new Array();
	ldcID = 0;
	//default value is that it is not commercial, so there will be no demand calculations
	isCommercial = 0;

	//set the pricingModel values
	pricingModel = new PricingModel();
	var pricingModelObj = body.pricingModel;

	//uncomment when testing on postman
/*	var str = body.pricingModel;
	var json = JSON.stringify(eval("(" + str + ")"));
	var pricingModelObj = JSON.parse(json); 
*/

	pricingModel.setRateType(pricingModelObj.rateType);
	pricingModel.setLDC(pricingModelObj.ldc);
	pricingModel.setCountry(pricingModelObj.country);
	pricingModel.setCity(pricingModelObj.city);

	
	//parese the data into the correct objects
	//parse consumption into consumption objects
	var conObj = body.consumption;

	//uncomment when testing on postman
/*	var str = body.consumption;
	var json = JSON.stringify(eval("(" + str + ")"));
	var conObj = JSON.parse(json); 
*/

	conObj.forEach(function(item){
		var inputConsumption = new Consumption();
		inputConsumption.setPoint(item.time, item.amount);
		consumption.push(inputConsumption);
	});


	//parse demand into demand objects if we are working with a commerical demand
	
	if (body.isCommercial != null)
	{
		if (body.isCommercial == "false")
			isCommercial = 0;
		else
			isCommercial = 1;
	}
	//demand information is only done for commercial users
	if (isCommercial){
		var demandObj = body.demand;

		//uncomment when testing on postman
	/*	var str = body.demand;
		var json = JSON.stringify(eval("(" + str + ")"));
		var demandObj = JSON.parse(json); 
	*/
		
		demandObj.forEach(function(item){
			var inputDemand = new Demand();
			inputDemand.setPoint(item.time, item.amount);
			demand.push(inputDemand);
		});
	}
	

	//get the id of the LDC that we will be using for calculations
	this.getLDCid(function(callWait){
		//first check to see if this is a special rate type (i.e. if it is Time Of Use instead of Spot Market or other name for spot market)
		if (pricingModel.getRateType() == "Time Of Use")
		{
			calculateToUConsumptionCost(function(callbackFromCalcs){
				
				//wait for consumption cost to be calculated
				if (isCommercial){
					calculateDemandCost(function(callbackFromCalcs){});
				}
				calculateFixedCost(function(callbackFromCalcs){
				calculateTotalCost(function(){
					var returnCost = JSON.stringify(totalCost);
					console.log("Returning total Cost string "+returnCost);
					callback(returnCost);
				});
			});

			});
			
		}
		else
		{
			//will need to edit this to use call backs
			calculateConsumptionCost(function(callbackFromCalcs){});
			if (isCommercial){
				calculateDemandCost(function(callbackFromCalcs){});
			}
			calculateFixedCost(function(callbackFromCalcs){
				calculateTotalCost(function(){
					var returnCost = JSON.stringify(totalCost);
					console.log("Returning total Cost string "+returnCost);
					callback(returnCost);
				});
			});
			
		}

	});	

}
RateEngine.prototype.getLDCid = function(callback){
	dbCalculations.ldcID(pricingModel.getLDC(),pricingModel.getRateType(),function(id){
		ldcID = id;
		callback();
	});

}

function calculateConsumptionCost(callback){
	var consLength = consumption.length;

	//check if the LDC is in Ontario, and therefore will use HOEP prices
	var hoep = ldcID;
	var city = pricingModel.getCity();
	if (city == "London" || city == "Toronto")
		hoep = 7;
	//will need to add additional if statments if new HOEP like prices are added for other cities/regions
	//if the hoep value is just for the city and not a region, the ldcID will just be used

	consumption.forEach(function(items)
	{


		//calculate the consumption 
		//get the rate amount from the database
		dbCalculations.regConsumption(ldcID, items.time,hoep, function(rates){
    		
    		//add a new consumptiion cost to the consumptionCost array
    		var tempCost = new Cost();
    		var calcCost = rates*items.amount;
    		tempCost.setPoint(items.time,calcCost);

    		consumptionCost.push(tempCost);
    		
    		//if the consumptionCost array is as long as the consumption array, all calculations are complete
    		if( consumptionCost.length == consLength )
    			callback();
    	});
    	
	});
	
}
function calculateToUConsumptionCost(callback){
	var consLength = consumption.length;
	consumption.forEach(function(items)
	{

		//find if the day of the week, is it a weekend
		//if the date is a string, then we need to make the time variable a date first
		var newDate = new Date(items.time);

		var dayOfTheWeek = newDate.getDay();
		var isWeekend = false;
		if (dayOfTheWeek == 6 || dayOfTheWeek == 7)
			isWeekend = true;


		//remove the day from the consumption time string
		var splits = items.time.split(" ");
		var timeToSend = splits[1];


		//calculate the consumption 
		//get the rate amount from the database
		dbCalculations.ToUConsumption(ldcID,timeToSend,isWeekend,function(rates){
    		
    		//add a new consumptiion cost to the consumptionCost array
    		var tempCost = new Cost();
    		var calcCost = rates*items.amount;
    		tempCost.setPoint(items.time,calcCost);

    		consumptionCost.push(tempCost);

    		//if the consumptionCost array is as long as the consumption array, all calculations are complete
    		if( consumptionCost.length == consLength )
    			callback();
    	});
    	
	});
	
}
function calculateDemandCost(callback){
	var demandLength = demand.length;
	demand.forEach(function(items)
	{
		//calculate the demand
		//get the rate amount from the database
		dbCalculations.regDemand(ldcID,function(rates){
    		
    		//add a new consumptiion cost to the demandCost array
    		var tempCost = new Cost();
    		var calcCost = rates*items.amount;
    		tempCost.setPoint(items.time,calcCost);
    		demandCost.push(tempCost);
    		
    		//if the demandCost array is as long as the demand array, all calculations are complete
    		if( demandCost.length == demandLength )
    			callback();
    	});
    	
	});
}
function calculateFixedCost(callback){
	//based off of all of the time values, we need to find out how many / what percentage of bills are part of the costs

	var firstDate = new Date(consumption[0].time);
	var lastDate = new Date(consumption[consumption.length-1].time);
	var timeDiff = Math.abs(lastDate.getTime() - firstDate.getTime());
	var hourDiff = timeDiff/(1000*3600);

	//find out how many bills the time represents
	//we assume a bill to be 30.42 days which equals 730.08 hours
	var billProportion = hourDiff/730.08;

	//call to the database to get all of the fixed rates for this LDC
	dbCalculations.fixedCosts(ldcID,function(rates){
			//fixed cost for total consumption
			var totalFixedCost = rates*billProportion;

			//each consumption point needs the correct porportion of fixed costs
			var pointCost = totalFixedCost / consumption.length;

			//make new cost variables for each point in the totalCost array
			consumption.forEach(function(item){
				var newCost = new Cost();
				newCost.setPoint(item.time,pointCost);
				fixedCost.push(newCost);

				if (fixedCost.length == consumption.length)
					callback();
			});
    	});
}

function calculateTotalCost(callback){
	for (var i = 0; i<consumptionCost.length;i++){
		var sum = 0;
		if (isCommercial)
		{
			sum = consumptionCost[i].amount + demandCost[i].amount + fixedCost[i].amount;
		}
		else
		{
			sum = consumptionCost[i].amount +fixedCost[i].amount;
		}
		var finalCost = new Cost();
		finalCost.setPoint(consumptionCost[i].time,sum);
		totalCost.push(finalCost);
		if (totalCost.length == consumptionCost.length)
			callback();
	}
}

<<<<<<< HEAD
module.exports = RateEngine;
=======
RateEngine.prototype.calculateTotalCost() = function() {
    return this.cost;
};

RateEngine.prototype.generateCostTime(cost,rateType) = function() {
    return;
};

RateEngine.prototype.getCostTime() = function() {
    return this.cost;
};

RateEngine.prototype.addPricingModel() = function() {
    return;
};

RateEngine.prototype.updatePricingModel() = function() {
    return;
};

RateEngine.prototype.deletePricingModel() = function() {
    return;
};

RateEngine.prototype.getPricingModel() = function() {
    return this.PricingModel;
};

*/
module.exports = RateEngine;
>>>>>>> master
