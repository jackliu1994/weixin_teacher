var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 3,
  host: 'localhost',
  user: 'jack',
  password: '19660323',
  database: 'leiblog'
});

function startQuery(){
  pool.getConnection(function (err, connection) {
    if (err) throw err;

    var value = 'jack';
    var query = connection.query('SELECT * FROM blog_admin WHERE username=?', value, function (err, ret) {
      if (err) throw err;

      console.log(ret);
      setTimeout(function () {
        connection.release();
        }, 1000);
    });
    console.log(query.sql);
  });
}

for (var i = 0; i < 10; i++) {
  startQuery();
}