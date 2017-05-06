var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'jack',
  password: '19660323',
  database: 'leiblog'
});

pool.getConnection(function (err, connection) {
  if (err) throw err;

  var value = 'jack';
  var query = connection.query('SELECT * FROM blog_admin WHERE username=?', value, function (err, ret) {
    if (err) throw err;

    console.log(ret);
    connection.release();
  });
  console.log(query.sql);
});