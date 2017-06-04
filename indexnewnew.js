var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var models=require('./models/models');
var session=require('express-session');
var moment=require('moment');
var JSON=require('JSON');
var fs = require('fs');


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


app.get('/detail/:id', function (req, res) {
	var studentid=req.params.id;
	var options = {
        hostname: 'api.mysspku.com',
        path: '/index.php/V2/StudentInfo/getDetail?stuid='+studentid+'&token=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		rejectUnauthorized: false
    };
				
	https.get(options, function (res1) {
		var datas=[];
		var size = 0;
		res1.on('data', function (data) {
			datas.push(data);
			size += data.length;
		});
		
		res1.on('end', function () {
			var buff = Buffer.concat(datas, size);
			var result = iconv.decode(buff, "utf8");
			var json = JSON.parse(result); 
			res.render('detail',{
                title: '学生详细信息',
				user: req.session.teacher,
                art: json.data,
                moment:moment
			}); 
		});	
	});
});


		
var weChatConfig = {
    token: '',
    Corpid: 'wx1d3765eb45497a18',
    corpsecret: 'OTrPYHpQvoqYdLRdFJ0s_M3KDJeq6stg_nQzbJxBDp3E20iKSx0TiwHzPv8eBTyG',
    encodingAESKey: '',
};

var OAuth  = require('wechat-oauth');
var client  = new OAuth(weChatConfig.Corpid, weChatConfig.corpsecret);
var accesstoken=fs.readFileSync('/home/qiyeweixinaccesstoken/token.dat',"utf-8");
var userid;
var https=require('https');

app.get('/user/oauth', function (req, res){
	var redirectUrl = '122.112.218.14:9111/start';
	var state = 'STATE';
	var scope = 'snsapi_userinfo'
	var url = client.getAuthorizeURL(redirectUrl, state, scope);
	res.redirect(url);
}); 

app.get('/start', function (req, res) {
   // 重定向之后可以通过 req.query.code获取code。
	var code=req.query.code; 
         
    https.get('https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+ accesstoken+'&code='+code,function(_res){
        _res.on('data', function(data) {
            var jsondata = JSON.parse(data);
            //获取到用户userid
			userid=jsondata.UserId;          
		    req.session.teacher=userid;     //userid存到session
			return res.redirect('/teacherinformation');
		});
    }).on('error', function(e) {                                                     
		return callback(err);
	});
	
});
var iconv = require('iconv-lite');
app.get('/teacherinformation', function (req, res) {
	var options = {
        hostname: 'api.mysspku.com',
        path: '/index.php/V2/TeacherInfo/getDetail?teacherid='+req.session.teacher+'&token=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		rejectUnauthorized: false
    };
				
	https.get(options, function (res1) {
		var datas=[];
		var size = 0;
		res1.on('data', function (data) {
			datas.push(data);
			size += data.length;
		});
		
		res1.on('end', function () {
			var buff = Buffer.concat(datas, size);
			var result = iconv.decode(buff, "utf8");
			var json = JSON.parse(result); 
			res.render('teacherinformation',{
                title: '个人信息',
				user: req.session.teacher,
                art: json.data,
                moment:moment
			}); 
		});	
	});
});



//student information 
app.get('/user/student', function (req, res){
	var redirectUrl = '122.112.218.14:9111/studentstart';
	var state = 'STATE';
	var scope = 'snsapi_userinfo'
	var url = client.getAuthorizeURL(redirectUrl, state, scope);
	res.redirect(url);
}); 

app.get('/studentstart', function (req, res) {
   // 重定向之后可以通过 req.query.code获取code。
	var code=req.query.code; 
         
    https.get('https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+ accesstoken+'&code='+code,function(_res){
        _res.on('data', function(data) {
            var jsondata = JSON.parse(data);
            //获取到用户userid
			userid=jsondata.UserId;
            
		    req.session.teacher=userid;     //userid存到session
			return res.redirect('/studentinformation');
		});
    }).on('error', function(e) {                                                     
		return callback(err);
	});
	
});
var iconv = require('iconv-lite');
app.get('/studentinformation', function (req, res) {
	var options = {
        hostname: 'api.mysspku.com',
        path: '/index.php/V2/TeacherInfo/getStudents?teacherid='+req.session.teacher+'&token=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		rejectUnauthorized: false
    };
	

	
	https.get(options, function (res1) {
		var datas=[];
		var size = 0;
		res1.on('data', function (data) {
			datas.push(data);
				//console.log("new bodychunk ", bodyChunks);
			size += data.length;
		});
		
		res1.on('end', function () {
			var buff = Buffer.concat(datas, size);
			var result = iconv.decode(buff, "utf8");
			//var json = eval('(' + result + ')'); 
			var json = JSON.parse(result); 
			res.render('studentinformation',{
                title: '学生列表',
				user: req.session.teacher,
                art: json.data.students,
                moment:moment
			}); 
		});

		
	
	});

});



//立项情况
app.get('/user/lx', function (req, res){
	var redirectUrl = '122.112.218.14:9111/lxstart';
	var state = 'STATE';
	var scope = 'snsapi_userinfo'
	var url = client.getAuthorizeURL(redirectUrl, state, scope);
	res.redirect(url);
}); 

app.get('/lxstart', function (req, res) {
   // 重定向之后可以通过 req.query.code获取code。
	var code=req.query.code; 
         
    https.get('https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+ accesstoken+'&code='+code,function(_res){
        _res.on('data', function(data) {
            var jsondata = JSON.parse(data);
            //获取到用户userid
			userid=jsondata.UserId;           
		    req.session.teacher=userid;     //userid存到session
			return res.redirect('/lxinformation');
		});
    }).on('error', function(e) {                                                     
		return callback(err);
	});
	
});
var iconv = require('iconv-lite');
app.get('/lxinformation', function (req, res) {
	var options = {
        hostname: 'api.mysspku.com',
        path: '/index.php/V2/TeacherInfo/getStudents?teacherid='+req.session.teacher+'&token=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		rejectUnauthorized: false
    };
	

	
	https.get(options, function (res1) {
		var datas=[];
		var size = 0;
		res1.on('data', function (data) {
			datas.push(data);
			size += data.length;
		});
		
		res1.on('end', function () {
			var buff = Buffer.concat(datas, size);
			var result = iconv.decode(buff, "utf8");
			var json = JSON.parse(result); 
			var json1; 
			var json2 ; 
			var j=0;
			var k=0;
			var json1 = {};
			json1.accept = [];
			json1.unaccept = [];
			
			for(var i=0; i<json.data.students.length; i=i+1) 
			{
				if(json.data.students[i].lxConfirm)
					json1.accept[json1.accept.length] = json.data.students[i];
				else
					json1.unaccept[json1.unaccept.length] = json.data.students[i];
					
			}
				
			res.render('lxinformation',{
                title: '立项情况',
				user: req.session.teacher,
                art1: json1.accept, //立项过了的
				art2: json1.unaccept,
                moment:moment
			}); 
		});

		
	
	});

});

//结项情况
app.get('/user/jx', function (req, res){
	var redirectUrl = '122.112.218.14:9111/jxstart';
	var state = 'STATE';
	var scope = 'snsapi_userinfo'
	var url = client.getAuthorizeURL(redirectUrl, state, scope);
	res.redirect(url);
}); 

app.get('/jxstart', function (req, res) {
   // 重定向之后可以通过 req.query.code获取code。
	var code=req.query.code; 
         
    https.get('https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+ accesstoken+'&code='+code,function(_res){
        _res.on('data', function(data) {
            var jsondata = JSON.parse(data);
            //获取到用户userid
			userid=jsondata.UserId;
            
		    req.session.teacher=userid;     //userid存到session
			return res.redirect('/jxinformation');
		});
    }).on('error', function(e) {                                                     
		return callback(err);
	});
	
});
var iconv = require('iconv-lite');
app.get('/jxinformation', function (req, res) {
	var options = {
        hostname: 'api.mysspku.com',
        path: '/index.php/V2/TeacherInfo/getStudents?teacherid='+req.session.teacher+'&token=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		rejectUnauthorized: false
    };
		
	https.get(options, function (res1) {
		var datas=[];
		var size = 0;
		res1.on('data', function (data) {
			datas.push(data);
			size += data.length;
		});
		
		res1.on('end', function () {
			var buff = Buffer.concat(datas, size);
			var result = iconv.decode(buff, "utf8");
			var json = JSON.parse(result); 
			var json1; 
			var json2 ; 
			var j=0;
			var k=0;
			var json1 = {};
			json1.accept = [];
			json1.unaccept = [];
			
			for(var i=0; i<json.data.students.length; i=i+1) 
			{
				if(json.data.students[i].jxConfirm)
					json1.accept[json1.accept.length] = json.data.students[i];
				else
					json1.unaccept[json1.unaccept.length] = json.data.students[i];
					
			}
					
			res.render('jxinformation',{
                title: '结项情况',
				user: req.session.teacher,
                art1: json1.accept, //立项过了的
				art2: json1.unaccept,
                moment:moment
			}); 
		});	
	});

});



//开题情况
app.get('/user/kt', function (req, res){
	var redirectUrl = '122.112.218.14:9111/ktstart';
	var state = 'STATE';
	var scope = 'snsapi_userinfo'
	var url = client.getAuthorizeURL(redirectUrl, state, scope);
	res.redirect(url);
}); 

app.get('/ktstart', function (req, res) {
   // 重定向之后可以通过 req.query.code获取code。
	var code=req.query.code; 
         
    https.get('https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+ accesstoken+'&code='+code,function(_res){
        _res.on('data', function(data) {
            var jsondata = JSON.parse(data);
            //获取到用户userid
			userid=jsondata.UserId;
            
		    req.session.teacher=userid;     //userid存到session
			return res.redirect('/ktinformation');
		});
    }).on('error', function(e) {                                                     
		return callback(err);
	});
	
});
var iconv = require('iconv-lite');
app.get('/ktinformation', function (req, res) {
	var options = {
        hostname: 'api.mysspku.com',
        path: '/index.php/V2/TeacherInfo/getStudents?teacherid='+req.session.teacher+'&token=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		rejectUnauthorized: false
    };
	
	https.get(options, function (res1) {
		var datas=[];
		var size = 0;
		res1.on('data', function (data) {
			datas.push(data);
			size += data.length;
		});
		
		res1.on('end', function () {
			var buff = Buffer.concat(datas, size);
			var result = iconv.decode(buff, "utf8");
			//var json = eval('(' + result + ')'); 
			var json = JSON.parse(result); 
			var json1; 
			var json2 ; 
			var j=0;
			var k=0;
			var json1 = {};
			json1.accept = [];
			json1.unaccept = [];
			
			for(var i=0; i<json.data.students.length; i=i+1) 
			{
				if(json.data.students[i].ktconfirm)
					json1.accept[json1.accept.length] = json.data.students[i];
				else
					json1.unaccept[json1.unaccept.length] = json.data.students[i];
					
			}			
				
			res.render('ktinformation',{
                title: '开题情况',
				user: req.session.teacher,
                art1: json1.accept, //立项过了的
				art2: json1.unaccept,
                moment:moment
			}); 
		});

		
	
	});

});


//论文情况
app.get('/user/paper', function (req, res){
	var redirectUrl = '122.112.218.14:9111/paperstart';
	var state = 'STATE';
	var scope = 'snsapi_userinfo'
	var url = client.getAuthorizeURL(redirectUrl, state, scope);
	res.redirect(url);
}); 

app.get('/paperstart', function (req, res) {
   // 重定向之后可以通过 req.query.code获取code。
	var code=req.query.code; 
         
    https.get('https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+ accesstoken+'&code='+code,function(_res){
        _res.on('data', function(data) {
            var jsondata = JSON.parse(data);
            //获取到用户userid
			userid=jsondata.UserId;
            
		    req.session.teacher=userid;     //userid存到session
			return res.redirect('/paperinformation');
		});
    }).on('error', function(e) {                                                     
		return callback(err);
	});
	
});
var iconv = require('iconv-lite');
app.get('/paperinformation', function (req, res) {
	var options = {
        hostname: 'api.mysspku.com',
        path: '/index.php/V2/TeacherInfo/getStudents?teacherid='+req.session.teacher+'&token=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
		rejectUnauthorized: false
    };
		
	https.get(options, function (res1) {
		var datas=[];
		var size = 0;
		res1.on('data', function (data) {
			datas.push(data);
				//console.log("new bodychunk ", bodyChunks);
			size += data.length;
		});
		
		res1.on('end', function () {
			var buff = Buffer.concat(datas, size);
			var result = iconv.decode(buff, "utf8");
			//var json = eval('(' + result + ')'); 
			var json = JSON.parse(result); 
			var json1; 
			var json2 ; 
			var j=0;
			var k=0;
			var json1 = {};
			json1.accept = [];
			json1.unaccept = [];
			
			for(var i=0; i<json.data.students.length; i=i+1) 
			{
				if(json.data.students[i].paperPass)
					json1.accept[json1.accept.length] = json.data.students[i];
				else
					json1.unaccept[json1.unaccept.length] = json.data.students[i];
					
			}
						
			res.render('paperinformation',{
                title: '论文情况',
				user: req.session.teacher,
                art1: json1.accept, //立项过了的
				art2: json1.unaccept,
                moment:moment
			}); 
		});	
	});

});

app.listen(9111,function(req,res){
	console.log('app is running at port 9111');
	
});