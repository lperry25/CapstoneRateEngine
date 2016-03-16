
var Consumption = require( './consumption' );
var Demand = require( './demand' );
var PricingModel = require( './pricingModel' );
var DemandSum = require( './demandSum' );
var Cost = require('./Cost' );
//var EnergyCost = require('./EnergyCost');
var TieredRateEngine = require( './tieredRateEngine' );
var TimeOfUseRateEngine = require( './timeOfUseRateEngine' );

var dbCalculations = require( '../rds/calculationQueries');

var consumptionCost  = new Array();
var consumption      = new Array();
var demand           = new Array();
var demandCost       = new Array();
var fixedCost        = new Array();
var totalCost        = new Array();
var lcdID            = 0;

var RateEngine = function() {
  /* ===== RateEngine Fields ===== */
  this.pricingModel    = new PricingModel();
  this.demandCost      = [];
  this.totalCost       = [];
};


  /* ===== RateEngine methods ===== */
RateEngine.prototype.calculateCost = function(body,callback) {
	//start by clearing all the variables used
	consumption = new Array();
	consumptionCost = new Array();
	demand = new Array();
	demandCost = new Array();
	fixedCost = new Array();
	totalCost = new Array();

	lcdID = getlcdID()

	//parese the data into the correct objects
	//parse consumption into consumption objects
	var str = body.consumption;
	var json = JSON.stringify(eval("(" + str + ")"));
	var conObj = JSON.parse(json);

/*	//uncomment for testing
	console.log("Made it to the rate Engine with Consumption "+ body.consumption);
	console.log("body as a string : "+str);
	console.log("body as a JSON : "+json);
	console.log("display object : "+conObj[0].amount);
*/
	
	conObj.forEach(function(item){
		var inputConsumption = new Consumption();
		inputConsumption.setPoint(item.time, item.amount);
		consumption.push(inputConsumption);
	});


	//parse demand into demand objects
	var str = body.demand;
	var json = JSON.stringify(eval("(" + str + ")"));
	var demandObj = JSON.parse(json);

/*	//uncomment for testing	
	console.log("Made it to the rate Engine with Demand "+ body.demand);
	console.log("body as a string : "+str);
	console.log("body as a JSON : "+json);
	console.log("display object : "+demandObj[0].amount);
*/
	
	demandObj.forEach(function(item){
		var inputDemand = new Demand();
		inputDemand.setPoint(item.time, item.amount);
		demand.push(inputDemand);
	});

/*
	for (var i=0; i <array.length;i++){
		var inputConsumption = new Consumption();
		inputConsumption.setPoint(array[i],array[i+1]);
		console.log("diplay new consumption point : "+ inputConsumption.getPoint());
	}

	//this.consumptionCost = body.consumption;
	//console.log("Consumption passed : " + this.consumption);
	body.consumption.forEach(function(item){
		console.log("the consumption" + item);
	});
*/
	//first check to see if this is a special rate type
	if(this.checkRateType())
	{
		//will need to edit this to use call backs
		this.calculateConsumptionCost(function(callbackFromCalcs){
		/*		//this.calculateTotalCost();
				console.log("Completed Conusumption Calculations");
				console.log("Returning consumption costs " + consumptionCost);
				var returnCost = JSON.stringify(consumptionCost);
				console.log("Returning string "+returnCost);
				//callback(returnCost);
		*/
		});
		this.calculateDemandCost(function(callbackFromCalcs){
		/*		//this.calculateTotalCost();
				console.log("Completed Demand Calculations");
				console.log("Returning demand costs " + demandCost);
				var returnCost = JSON.stringify(demandCost);
				console.log("Returning demand Cost string "+returnCost);
				*/
		});
		this.calculateFixedCost(function(callbackFromCalcs){
			calculateTotalCost(function(){
				var returnCost = JSON.stringify(totalCost);
				console.log("Returning total Cost string "+returnCost);
				callback(returnCost);
			});
		});
		//callback(this.totalCost);
		//after returning all the values will need to make new 
	}	
}

RateEngine.prototype.checkRateType = function (){
	console.log("checkingRateType");
	console.log(this.pricingModel.getRateType());
	if (this.pricingModel.getRateType() == "Time Of Use")
	{
	//	var timeOfUseRE = new TimeOfUseRateEngine();
		return false;
	}
	else if(this.pricingModel.getRateType() == "Tiered")
	{
	//	var tieredRE = new TieredRateEngine();
		return false;
	}
	else{
		return true;
	}	
}

RateEngine.prototype.calculateConsumptionCost = function(callback){
	var consLength = consumption.length;
	consumption.forEach(function(items)
	{
		//calculate the consumption 
		//get the rate amount from the database
		dbCalculations.regConsumption(function(rates){
    		//res.send(message);
    		console.log("consumption amount : "+items.amount);
    		console.log("rateAmount: "+rates);
    		//add a new consumptiion cost to the consumptionCost array
    		var tempCost = new Cost();
    		var calcCost = rates*items.amount;
    		tempCost.setPoint(items.time,calcCost);
    		console.log(tempCost);
    		consumptionCost.push(tempCost);
    		console.log("Value added to consumption cost : "+consumptionCost);
    		//callback();
    		//console.log(this.consumptionCost);
    		//testConsCost.push(tempCost);
    		console.log("consumptionCost length = " +consumptionCost.length);
    		//if the consumptionCost array is as long as the consumption array, all calculations are complete
    		if( consumptionCost.length == consLength )
    			callback();
    	});
    	
	});
	
}
RateEngine.prototype.calculateDemandCost = function(callback){
	var demandLength = demand.length;
	demand.forEach(function(items)
	{
		//calculate the demand
		//get the rate amount from the database
		dbCalculations.regDemand(function(rates){
    		//res.send(message);
    		console.log("demand amount : "+items.amount);
    		console.log("rateAmount: "+rates);
    		//add a new consumptiion cost to the demandCost array
    		var tempCost = new Cost();
    		var calcCost = rates*items.amount;
    		tempCost.setPoint(items.time,calcCost);
    		console.log(tempCost);
    		demandCost.push(tempCost);
    		console.log("Value added to demand cost : "+demandCost);
    		//callback();
    		//console.log(this.demandCost);
    		//testConsCost.push(tempCost);
    		console.log("demandCost length = " +demandCost.length);
    		//if the demandCost array is as long as the demand array, all calculations are complete
    		if( demandCost.length == demandLength )
    			callback();
    	});
    	
	});
}
RateEngine.prototype.calculateFixedCost = function(callback){
	//based off of all of the time values, we need to find out how many / what percentage of bills are part of the costs

	var firstDate = new Date(consumption[0].time);
	var lastDate = new Date(consumption[consumption.length-1].time);
	var timeDiff = Math.abs(lastDate.getTime() - firstDate.getTime());
	var hourDiff = timeDiff/(1000*3600);

	//find out how many bills the time represents
	//we assume a bill to be 30.42 days which equals 730.08 hours
	var billProportion = hourDiff/730.08;
	console.log("time porportion of bill : " + billProportion);

	//call to the database to get all of the fixed rates for this LDC
	dbCalculations.fixedCosts(function(rates){
			//fixed cost for total consumption
			console.log("bills fixed cost : "+rates);
			var totalFixedCost = rates*billProportion;
			console.log("total fixed cost for this consumption : "+totalFixedCost);

			//each consumption point needs the correct porportion of fixed costs
			var pointCost = totalFixedCost / consumption.length;
			console.log("cost per point : " + pointCost);

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
	console.log("in calculate total cost");
	for (var i = 0; i<consumptionCost.length;i++){
		var sum = 0;
		sum = consumptionCost[i].amount + demandCost[i].amount + fixedCost[i].amount;
		var finalCost = new Cost();
		finalCost.setPoint(consumptionCost[i].time,sum);
		totalCost.push(finalCost);
		if (totalCost.length == consumptionCost.length)
			callback();
	}
}
/*

 //Ones from the original design
RateEngine.prototype.calculateDemandSum() = function() {
    return this.DemandSum;
};

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