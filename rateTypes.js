var connection = require('../rds/connection.js');
var Schema = conneciton.Schema;

var RateTypesSchema = new Schema({
	rateType: String
});

module.exports = connection.model('RateTypes',RateTypesSchema);