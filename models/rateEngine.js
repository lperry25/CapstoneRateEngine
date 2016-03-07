
var Consumption = require( './consumption' );
var Demand = require( './demand' );
var PricingModel = require( './pricingModel' );
var DemandSum = require( './demandSum' );
var Cost = require('./Cost' );
//var EnergyCost = require('./EnergyCost');
var TieredRateEngine = require( './tieredRateEngine' );
var TimeOfUseRateEngine = require( './timeOfUseRateEngine' );

var dbCalculations = require( '../rds/calculationQueries');

var consumptionCost = new Array();
var consumption = new Array();

var RateEngine = function() {
  /* ===== RateEngine Fields ===== */
  this.demand          = [];
  this.pricingModel    = new PricingModel();
  this.demandCost      = [];
  this.fixedCost       = [];
  this.totalCost       = [];
};


  /* ===== RateEngine methods ===== */
RateEngine.prototype.calculateCost = function(body,callback) {
	//start by clearing all the variables used
	consumption = new Array();
	consumptionCost = new Array();
	console.log("Made it to the rate Engine with Consumption "+ body.consumption);
	var str = body.consumption;
	console.log("body as a string : "+str);
	var json = JSON.stringify(eval("(" + str + ")"));
	console.log("body as a JSON : "+json);
	var obj = JSON.parse(json);
	console.log("display object : "+obj[0].amount);

	
	obj.forEach(function(item){
		var inputConsumption = new Consumption();
		inputConsumption.setPoint(item.time, item.amount);
		console.log("new consumption : "+ inputConsumption.amount);
		consumption.push(inputConsumption);
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
				//this.calculateTotalCost();
				console.log("Completed Conusumption Calculations");
				console.log("Returning consumption costs " + consumptionCost);
				var returnCost = JSON.stringify(consumptionCost);
				console.log("Returning string "+returnCost);
				callback(returnCost);
			});
			this.calculateDemandCost();
			this.calculateFixedCost();
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
	console.log("The lenght of the consumption Array is "+consLength); 
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
RateEngine.prototype.calculateDemandCost = function(){
	
}
RateEngine.prototype.calculateFixedCost = function(){
	
}
/*
RateEngine.prototype.calculateTotalCost() = function {

}


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