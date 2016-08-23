'use strict'
const express =  require('express'),
      bodyParser = require('body-parser'),
      wxSignature = require('./wx_signature'),
      wxAuth = require('./wx_auth'),
      app = express();

//微信2小时刷新(动态获取access_token以及jsapi_ticket)
  wxSignature.getTokenAndTicket(); //第一次初始化
  setInterval(function(){
  wxSignature.getTokenAndTicket();
  },7200)

//请求主体解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//获取当前用户(上传当前完整路径)
app.post('/wxSignature',function(req,res){
    let currentUrl = req.body.currentUrl;
    wxSignature.wxSignature(req,res,currentUrl) //签名
})

//获取当前用户微信的信息
app.post('/wxUserInfor',function(req,res){
    wxAuth.getWxUserInfor(req,res)
})


app.listen(5086,function(){
	console.log('微信签名服务器已经启动');
})
