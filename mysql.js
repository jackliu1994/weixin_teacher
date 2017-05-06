var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'jack',
  password: '19660323',
  database: 'leiblog'
});

connection.connect(function (err) {
  if (err) throw err;
  connection.query('SELECT * FROM blog_admin', function (err, ret) {
    if (err) throw err;
    console.log(ret);
    connection.end();
  });
});