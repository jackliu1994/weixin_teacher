
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'jack',
    password: '19660323',
    database:'leiblog'
});
connection.connect();
var  userAddSql = 'INSERT INTO noteuser(username,passwd) VALUES(?,?)';
var  userAddSql_Params = ['Wilson', '123'];
//Ôö add
connection.query(userAddSql,userAddSql_Params,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }       
       console.log('-------INSERT----------');
       //console.log('INSERT ID:',result.insertId);       
       console.log('INSERT ID:',result);       
       console.log('#######################'); 
});
connection.end();