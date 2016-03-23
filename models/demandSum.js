var DemandSum = function(){
	/* ===== DemandSum Fields ===== */
	this.time     = new Date();
	this.amount   = 0;
};

/* ===== DemandSum methods ===== */
DemandSum.prototype.setPoint = function( time, amount ) {
  this.time   = time;
  this.amount = amount;
};

DemandSum.prototype.getPoint = function() {
  return { time   : this.time, 
           amount : this.amount 
         };
};

module.exports = DemandSum;