//sample code
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'fintech'
});
 
connection.connect();
 
connection.query('SELECT * FROM member', function (error, results, fields) {
  if (error) throw error;
  console.log(results);
});
 
connection.end();