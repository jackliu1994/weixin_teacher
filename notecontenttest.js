var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'jack',
    password: '19660323',
    database:'leiblog'
});

connection.connect(function (err) {
  if (err) throw err;

  var value = 'jack';
  var query =  connection.query('SELECT * FROM noteuser where username="'+value+'"', function (err, ret) {
    if (err) throw err;

    console.log(ret[0].passwd);
    
  });

  
});


var value = 'jack';

  var query =  connection.query('SELECT * FROM notefile where author="'+value+'"', function (err, ret) {
    if (err) {
			console.log('err1 is:'+err);
			
		}
  
    console.log(ret);
		/* password=null;
		delete user.password; */
		
   


  
});
