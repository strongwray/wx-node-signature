'use strict'
const express =  require('express'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      app = express();

//请求主体解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//解析cookie
app.use(cookieParser())

app.listen(3000,function(){
	console.log('微信签名服务器已经启动');
})
