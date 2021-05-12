var mysql  = require('mysql');

/*var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '123456',
  port: '3306',
  database: 'sys'
});*/
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'perdsoul',
    password : 'like940705',
    port: '3306',
    database: 'web3dtestdata'
});

connection.connect();

var  sql = 'SELECT * FROM testdata2';
connection.query(sql,function (err, data) {
  require('fs').writeFile('testResult.json' , JSON.stringify(data , null, "\t") , function(){});
});
connection.end();
