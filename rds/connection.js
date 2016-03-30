var mysql = require('mysql');

// Create connection with compardb configuration.
// TODO: Should change this to use connection pooling.
 /*
var connection = mysql.createConnection({
  host     : 'rateengine.chjpa4e5niju.us-west-2.rds.amazonaws.com',
  user     : 'capstone',
  password : 'capstone',
  database : 'rateengdb', 
  ssl      : 'Amazon RDS'
});
*/

var connection = mysql.createPool({
  connectionLimit : 20,
  host     : 'rateengine.chjpa4e5niju.us-west-2.rds.amazonaws.com',
  user     : 'capstone',
  password : 'capstone',
  database : 'rateengdb', 
  ssl      : 'Amazon RDS'
});

module.exports = connection;
