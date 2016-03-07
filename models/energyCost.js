var DemandBasedCost = require( './demandBasedCost' );
var ConsumptionBasedCost = require( './consumptionBasedCost' );
var FixedCost = reuqire( './fixedCost' );

var EnergyCost = function() {
  /* ===== RateEngine Fields ===== */
  this.time                 = new Date();
  this.rateType             = "";
  this.DemandBasedCost      = new DemandBasedCost();
  this.consumptionBasedCost = new ConsumptionBasedCost();
  this.fixedCost            = new Cost();
  this.totalCost            = 0;
};

  /* ===== EnergyCost methods ===== */
EnergyCost.prototype.generateDemandCost(demand) = function() {
    this.demandBasedCost = 0;
    return;
};
EnergyCost.prototype.generateConsumptionCost(demand) = function() {
    this.consumptionBasedCost = 0;
    return;
};
EnergyCost.prototype.generateFixedCost(demand) = function() {
    this.fixedCost = 0;
    return;
};
EnergyCost.prototype.calculateTotalCost(demand) = function() {
    this.totalCost = this.demandBasedCost + this.consumptionBasedCost + this.fixedCost;
    return this.totalCost;
};
module.exports = RateEngine;