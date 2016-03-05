var express = require('express');
var query = require('../rds/queries');
var router = express.Router();
var app = express();
//added for model test
//var RateTypes = require('../models/rateTypes');
var connection = require('../rds/connection');

// GET home page. 
router.get('/', function(req, res, next) {
  res.sendfile('index.html');
});
/*
router.get('/getRateTypes',function(req,res,next){
	connection.query('SELECT * FROM RateTypes', function(err, rows, fields) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        res.send(rows);
      }
    });
});

router.get('/getLDCs',function(req,res,next){
	connection.query('SELECT * FROM LDC', function(err, rows, fields) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        res.send(rows);
      }
    });
});

/*THIS DOES NOT WORK!!!!!!
router.get('/addRateType',function(req,res,next){
//	var input = JSON.parse(JSON.stringify(req.params));
//	var value = req.
	connection.query('INSERT INTO RateTypes (rateType) VALUES ?;','Tiered', function(err, rows, fields) {
      if(err) {
        console.log(err);
        throw err;
      } else {
        res.send(rows);
      }
    });
});
/*
var query = {
  getRateTypes : function(req, res, next) {
    // Query using existing connection.
    
  },
  addRateType : function(req, res, next) {
    // Query using existing connection.
    
  },
};

// Export all functions.
module.exports = query;


/*
	app.use('/getRateTypes', query.getRateTypes);


router.put('/addRateType',function(req,res,next){
	var value = req.body.name;
	app.use('/addRateType',query.addRateType('Tiered'));
});



router.route('/ratetypes')
	.post(function(req,res){
		var rate = new RateTypes();
		rate.rateType = req.body.name;

		rate.save(function(err){
			if(err)
				res.send(err);
			res.json({message: 'RateType created!'});
		});
	});
*/

module.exports = router;
