'use strict'
const express =  require('express'),
      bodyParser = require('body-parser'),
      wxSignature = require('./wx_signature'),
      app = express();

//请求主体解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//单个路由(上传当前完整路径)
app.post('/wxSignature',function(req,res){
    let currentUrl = req.body.currentUrl;
    wxSignature.wxSignature(req,res,currentUrl) //签名
})

app.listen(5086,function(){
	console.log('微信签名服务器已经启动');
})
