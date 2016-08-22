'use strict'
const sha1 = require('sha1'),
      async = require('async'),
      request = require('request'),
      config = require('./config');

//获取微信jssdk
exports.wxSignature = function(req,res,url){
  let obj = {};
      obj.timestamp = parseInt(new Date().getTime() / 1000) + '', //生成签名的时间戳
      obj.nonceStr = Math.random().toString(36).substr(2,15), //生成签名的随机串
      obj.appId = config.wxConfig.appId;
      obj.signature = signatureStr(config.jsapi_ticket,obj.nonceStr,obj.timestamp,url) //生成签名
      res.send(obj)
}
//签名认证
let signatureStr = function(ticket,nonceStr,timestamp,url){
   let str = "jsapi_ticket=" + ticket + "&noncestr=" + nonceStr + "&timestamp=" + timestamp + "&url=" + url;
       return sha1(str)
}

//获取access_token以及jsapi_ticket(过期时间微信暂时是2个小时)存储在全局app.locals
exports.getTokenAndTicket = function(){
  async.waterfall([
  function(callback){
    //获取token api
    let getTokenUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${config.wxConfig.appId}&secret=${config.wxConfig.appSecret}`;
    //第一步获取access_token
    request(getTokenUrl,function (error, response, body) {
    if (!error && response.statusCode == 200) {
          let tokenData = JSON.parse(body);
          config.access_token = tokenData.access_token; //存储在全局
          callback(null,tokenData);
      }
    })
  },function(tokenData,callback){
    //第二步获取
    let getTicketUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${tokenData.access_token}&type=jsapi`;
    request(getTicketUrl,function (error, response, body) {
    if (!error && response.statusCode == 200) {
          let data = JSON.parse(body);
          config.jsapi_ticket = data.ticket; //存储在全局
      }
    })
  }
  ],function(err,result){
    if(err) throw err
  })
}
