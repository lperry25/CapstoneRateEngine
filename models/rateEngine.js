
var Consumption = require( './consumption' );
var Demand = require( './demand' );
var PricingModel = require( './pricingModel' );
var Cost = require('./cost' );
var dbCalculations = require( '../rds/calculationQueries');
var Sort = require('node-sort');
var sort = new Sort();


//attributes
var consumptionCost  = new Array();
var consumption      = new Array();
var demand           = new Array();
var demandCost       = new Array();
var totalCost        = new Array();
var pricingModel     = new PricingModel();
var fixedCost        = 0;
var ldcID            = 0;
var isCommercial     = 0;
var totalCostValue   = 0;
var currentMaxDemand = 0;
var demandProp       = 0;
var consumptionLength = 0;


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
	totalCost = new Array();
	fixedCost = 0;
	ldcID = 0;
	totalCostValue = 0
	currentMaxDemand = 0;
	demandProp = 0;
	consumptionLength = 0;

	//default value is that it is not commercial, so there will be no demand calculations
	isCommercial = 0;


    var totalCostComparator = function( a, b ) {
    	if( new Date(a.time) > new Date(b.time) ) return 1;
        else if (new Date(a.time) < new Date(b.time)) return -1;
        else if (new Date(a.time) == new Date(b.time)) return 0;
    };

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

	console.log("The pricing model is "+pricingModel.getRateType());
	
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
	//console.log("the sent isCommercial value is "+ body.isCommercial);

	if (body.isCommercial != null)
	{
		if (body.isCommercial == false)
		{
			isCommercial = 0;
		}
		else
		{
			isCommercial = 1;

		}
	}

	if(body.consumptionLength != null)
		consumptionLength = body.consumptionLength;

	//console.log("the is commercial variable is " + isCommercial);

	//demand information is only done for commercial users
	if (isCommercial){
		//var demandObj = body.demand;

		//uncomment when testing on postman
/*		var str = body.demand;
		var json = JSON.stringify(eval("(" + str + ")"));
		var demandObj = JSON.parse(json); 
	
		
		demandObj.forEach(function(item){
			var inputDemand = new Demand();
			inputDemand.setPoint(item.time, item.amount);
			demand.push(inputDemand);
		});
*/
		if (body.maxDemand != null)
				currentMaxDemand = body.maxDemand;
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
						
					calculateFixedCost(function(callbackFromCalcs){
						calculateTotalCost(function(){
				            //var returnCost = JSON.stringify(sort.mergeSort(totalCost, totalCostComparator),totalCostValue);
				            totalCost = sort.mergeSort(totalCost, totalCostComparator);
				            totalCostValue = Math.round(totalCostValue*100)/100;
				            var returnCostValue = totalCostValue.toString();
							var returnObject = {totalCost: totalCostValue,
											  costArray: totalCost};
							callback(returnObject);
						});
					});
				}
				else
				{
					calculateFixedCost(function(callbackFromCalcs){
						calculateTotalCost(function(){
		                    //var returnCost = JSON.stringify(sort.mergeSort(totalCost, totalCostComparator),totalCostValue);
		                    totalCost = sort.mergeSort(totalCost, totalCostComparator);
		                    totalCostValue = Math.round(totalCostValue*100)/100
		                    var returnCostValue = totalCostValue.toString();
							var returnObject = {totalCost: totalCostValue,
									  costArray: totalCost};
							callback(returnObject);
							//callback(returnCost);
						});
					});
				}
			});	
		}
		else
		{
			//will need to edit this to use call backs
			calculateConsumptionCost(function(callbackFromCalcs){
				if (isCommercial){
					calculateDemandCost(function(callbackFromCalcs){
						calculateFixedCost(function(callbackFromCalcs){
							calculateTotalCost(function(){
					            //var returnCost = JSON.stringify(sort.mergeSort(totalCost, totalCostComparator),totalCostValue);
					            totalCost = sort.mergeSort(totalCost, totalCostComparator);
					            totalCostValue = Math.round(totalCostValue*100)/100;
					            var returnCostValue = totalCostValue.toString();
								var returnObject = {totalCost: totalCostValue,
												  costArray: totalCost};
								callback(returnObject);
							});
						});
					});	
				}
				else
				{
					calculateFixedCost(function(callbackFromCalcs){
						calculateTotalCost(function(){
		                    totalCost = sort.mergeSort(totalCost, totalCostComparator);
		                    totalCostValue = Math.round(totalCostValue*100)/100
		                    var returnCostValue = totalCostValue.toString();
							var returnObject = {totalCost: totalCostValue,
									  costArray: totalCost};
							callback(returnObject);
						});
					});
				}	
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
	if (city == "London" || city == "Toronto" || city == "Hamilton" || city == "Oshawa" || city == "Windsor")
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
    		{
    			callback();
    		}
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
		if (dayOfTheWeek == 6 || dayOfTheWeek == 0)
			isWeekend = true;


		//remove the day from the consumption time string
		//first check to make sure time is not null, to avoid the server from crashing
		if (items.time != null)
		{
			var splits = items.time.split(" ");
			var timeToSend = splits[1];
		}
		else 
		{
			var timeToSend = 0;
			console.log("time was null " +items.time);
		}
		
		
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
    		{
    			callback();
    		}
    	});
    	
	});
	
}
function calculateDemandCost(callback){

	//demandMax(function(callbackVal){
		
		dbCalculations.regDemand(ldcID,function(rates){

			//calculate the total cost
			console.log("this is the demand rate returned " + rates);
			var isDone = false;
			var totalDemandCost = rates * currentMaxDemand;

			//find the average demand cost per consumption pointCost
			if (consumption.length > 1)
				demandProp = totalDemandCost / consumption.length;	
			else
				demandProp = totalDemandCost / consumptionLength;

	    	if (totalDemandCost != null)
	    		callback();
    	});
//	});
	
}
function calculateFixedCost(callback){
	//based off of all of the time values, we need to find out how many / what percentage of bills are part of the costs
	var billProportion = 0;

	if(consumption.length > 1)
	{
		var firstDate = new Date(consumption[0].time);
		var lastDate = new Date(consumption[consumption.length-1].time);
		var timeDiff = Math.abs(lastDate.getTime() - firstDate.getTime());
		var hourDiff = timeDiff/(1000*3600);

		//find out how many bills the time represents
		//we assume a bill to be 30.42 days which equals 730.08 hours
		billProportion = hourDiff/730.08;
	}
	else
	{
		//assuming that each point is one hour, we can see how many hours of consumption there is
		billProportion = consumption.length / 730.08;
	}
	

	//call to the database to get all of the fixed rates for this LDC
	dbCalculations.fixedCosts(ldcID,function(rates){
			//fixed cost for total consumption
			var totalFixedCost = rates*billProportion;

			//each consumption point needs the correct porportion of fixed costs
			var pointCost = totalFixedCost / consumption.length;
			if (consumption.length > 1)
				fixedCost = totalFixedCost / consumption.length;
			else
				fixedCost = totalFixedCost / consumptionLength;

			callback();

			//make new cost variables for each point in the totalCost array
		/*	consumption.forEach(function(item){
				var newCost = new Cost();
				newCost.setPoint(item.time,pointCost);
				if(newCost == undefined || newCost == null || newCost == "")
					console.log("the newCost is undefined");
				fixedCost.push(newCost);

				if (fixedCost.length == consumption.length)
					callback();
			});
*/
    	});
}

function maxDemand(returnDemand){
	var count = 0;
	demand.forEach(function(item){
		if (item.amount > currentMaxDemand)
		{
			currentMaxDemand = item.amount;
			console.log("the currentMaxDemand is " + currentMaxDemand);
		}
		count = count +1;
		if (count > demand.length)
			returnDemand();
	});

}

function calculateTotalCost(callback){
	console.log("the max demand is " + currentMaxDemand);
	console.log("demand porportion is " + demandProp);
	//console.log("the fixed cost length is " + fixedCost.length);
	//console.log("the consumption length is " + fixedCost.length);
	for (var i = 0; i<consumptionCost.length;i++){
		
		var sum = 0;
		//if(consumption.length == 1)
		//{
			//console.log("the consumption cost is "+consumptionCost[i].amount);
			//console.log("the fixed cost is fixedCost "+fixedCost[i]);	
		//}
		
		sum = consumptionCost[i].amount +fixedCost + demandProp;
		totalCostValue = totalCostValue + sum;
		//round the sum to only two digits
		sum = Math.round(sum*100)/100;
		
		var finalCost = new Cost();
		finalCost.setPoint(consumptionCost[i].time,sum);
		totalCost.push(finalCost);
		if (totalCost.length == consumptionCost.length)
			callback();
	}
}

module.exports = RateEngine;

