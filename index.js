var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var mongoose=require('mongoose');
var models=require('./models/models');
var session=require('express-session');
var checkLogin=require('./checkLogin.js');
var moment=require('moment');
mongoose.connect('mongodb://localhost:27017/notes');
mongoose.connection.on('error',console.error.bind(console,'连接数据库失败'));

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



  



var app = express();
app.set('views',path.join(__dirname, 'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true }));

app.use(session({
	secret:'1234',
	name:'mynote',
	cookie:{maxAge:1000*60*20},
	resave:false,
	saveUninitialized: true
}));
var User=models.User;
var Note=models.Note;
var str1='用户名';
var str2="密码";
app.get('/',checkLogin.noLogin);
app.get('/', function (req, res) {
    var value = req.session.user[0].username;
  var query =  connection.query('SELECT * FROM notefile where author="'+value+'"', function (err, ret) {
    if (err) {
			console.log('err1 is:'+err);
			
		}
  
    console.log(ret);
		
	  res.render('index', {
            user: req.session.user[0].username,
            notes: ret,
            title: '首页'
        });	
   


  
});
	
	
	
/* 	Note.find({author: req.session.user[0].username}).exec(function (err, allNotes) {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        
        res.render('index', {
            user: req.session.user,
            notes: allNotes,
            title: '首页'
        });
    }) */
});
app.get('/register', function(req, res) {
  console.log('注册');
  res.render('register',{
	  user:req.session.user,
	  zhanghao: str1,
      mima:str2,
	  title: '注册'
  });
});

//post 请求
app.post('/register',function(req,res){
	var username=req.body.username,
	    password=req.body.password,
		passwordRepeat=req.body.passwordRepeat;
	var regEx1="/^[a-z]|[A-Z]|[0-9]|[_]{3,20}$/";
	if(!username.match(regEx1)){
   str1 = "用户名只能是字母、数字，下划线的组合，长度 3-20 个字符";
   console.log("用户名只能是字母、数字，下划线的组合，长度 3-20 个字符");
   return res.redirect('/register');
   }else{str1="用户名";}
   
   if(!(password.match(/([0-9])+/) && password.match(/([A-Z])+/) &&
password.match(/([a-z])+/) && password.length>6 )) {
str2="密码长度不能少于 6，必须同时包含数字、大/小写字母";
console.log("密码长度不能少于 6，必须同时包含数字、大/小写字母");
return res.redirect('/register');
}else{str2="密码";}

	if(username.trim().length==0){
		console.log('用户名不能为空');
		return res.redirect('/register');	
	}
	
	if(password.trim().length==0 || passwordRepeat.trim().length==0){
		console.log('密码不能为空');
		return res.redirect('/register');	
	}
	
	if(password != passwordRepeat){
		console.log('两次密码不一致');
		return res.redirect('/register');	
	}
	
	
var  userAddSql = 'INSERT INTO noteuser(username,passwd) VALUES(?,?)';
var  userAddSql_Params = [username, password];
//增 add
connection.query(userAddSql,userAddSql_Params,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return res.redirect('/register');
        }       
      console.log('注册成功');
			return res.redirect('/');
});

	
	
	
	/* User.findOne({username:username},function(err,user){
		if(err){
			console.log(err);
			return res.redirect('/register');
		}
		
		if(user){
			console.log(err);
			return res.redirect('/register');
		}
		
		var md5=crypto.createHash('md5'),
		    md5password=md5.update(password).digest('hex');
			
		var newUser=new User({
			username:username,
			password:md5password
		});	
		
		newUser.save(function(err,doc){
			if(err){
				console.log(err);
			return res.redirect('/register');
			}
			console.log('注册成功');
			return res.redirect('/');
		});
}); */
});

app.get('/login', function (req, res) {
    console.log('登陆！');
    res.render('login', {
         user: req.session.user, 
        title: '登陆',
        /* zhanghao: str3, */
        /* mima:str4 */
    });
});


app.post('/login',function(req,res){
	var username=req.body.username,
	    password=req.body.password;
		
	
  var value = username;
  console.log(username);
  var query =  connection.query('SELECT * FROM noteuser where username="'+value+'"', function (err, ret) {
    if (err) {
			console.log('err1 is:'+err);
			return res.redirect('/login');
		}
    if(password!==ret[0].passwd){
			console.log('密码错误！');
			return res.redirect('/login');			
		}
    console.log('登录成功');
		/* password=null;
		delete user.password; */
		req.session.user=ret;
		console.log(req.session.user);
		return res.redirect('/');
   


  
});

/* 	
	User.findOne({username:username},function(err,user){
		if(err){
			console.log(err);
			return res.redirect('/login');
		}
		
		if(!user){
			console.log('用户不存在');
			return res.redirect('/login');
		}
		
		var md5=crypto.createHash('md5'),
		    md5password=md5.update(password).digest('hex');
			
		if(user.password!==md5password){
			console.log('密码错误！');
			return res.redirect('/login');			
		}
		console.log('登录成功');
		user.password=null;
		delete user.password;
		req.session.user=user;
		return res.redirect('/');
		
     }); */
});


app.get('/quit', function(req, res) {
  req.session.user=null;
  console.log('退出');
  return res.redirect('/login');
});
app.get('/post', function(req, res) {
  console.log('发布');
  res.render('post',{ 
     user: req.session.user, 
	  title: '发布'
  });
});


app.post('/post', function (req, res) {

    var note = new Note({
        title: req.body.title,
        author: req.session.user[0].username,
        tag: req.body.tag,
        content: req.body.content
    });
var  userAddSql = 'INSERT INTO notefile(title,author,tag,content) VALUES(?,?,?,?)';
var  userAddSql_Params = [note.title,note.author,note.tag,note.content];
//增 add
connection.query(userAddSql,userAddSql_Params,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return res.redirect('/post');
        }       
       console.log('文章发表成功！');
        return res.redirect('/');
});
 /*    note.save(function (err, doc) {
        if (err) {
            console.log(err);
            return res.redirect('/post');
        }
        console.log('文章发表成功！');
        return res.redirect('/');
    }); */
});
app.get('/detail/:id', function (req, res) {
    console.log('查看笔记！');
	
	 var value = req.params.id;
  var query =  connection.query('SELECT * FROM notefile where id="'+value+'"', function (err, ret) {
    if (err) {
			console.log('err1 is:'+err);
			
		}
   if(ret){
            res.render('detail',{
                title: '笔记详情',
                user: req.session.user[0].username,
            art:ret[0],
            moment:moment
            });
        }
    console.log(ret);
		
	
   


  
});
	
   /*  Note.findOne({_id: req.params._id}).exec(function (err,art) {
       if(err){
           console.log(err);
           return res.redirect('/');
       }
        if(art){
            res.render('detail',{
                title: '笔记详情',
                user: req.session.user,
            art:art,
            moment:moment
            });
        }
    }); */

});
app.listen(3000,function(req,res){
	console.log('app is running at port 3000');
	
});