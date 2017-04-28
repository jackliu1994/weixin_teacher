var express = require('express');
var WXBizMsgCrypt = require('wechat-crypto');

var config = {
	token: 'yuntu',
 	encodingAESKey: 'GdvMQpZdK3DsLTR4lFkLV5VFojSx3IRctUtJTcjevBw',
  	corpId: 'wx1d3765eb45497a18'
};

var app = express();

app.get('/wxservice', function(req, res){
	var msg_signature = req.query.msg_signature;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	var echostr = req.query.echostr;
	var cryptor = new WXBizMsgCrypt(config.token, config.encodingAESKey, config.corpId)
	var s = cryptor.decrypt(echostr);
	res.send(s.message);
});

app.listen(9111);

console.log('Server running at http://127.0.0.1:1337/');
