var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'jack',
  password: '19660323',
  database: 'leiblog'
});

connection.connect(function (err) {
  if (err) throw err;

var value ='jack';
  var query =  connection.query('SELECT * FROM blog_admin where username=?',value, function (err, ret) {
    if (err) throw err;

    console.log(ret);
    connection.end();
  });

  console.log(query.sql);
});