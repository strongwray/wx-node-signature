'use strict'
const async = require('async'),
      request = require('request'),
      config = require('./config');

//获取微信用户信息
exports.getWxUserInfor = function(req,res){
  async.waterfall([
  function(callback){ //获取access_token
    let code = req.body.code,
        getTokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${config.wxConfig.appId}&secret=${config.wxConfig.appSecret}&code=${code}&grant_type=authorization_code`;
        request(getTokenUrl,function (error,response,body) {
            if (!error && response.statusCode == 200) {
                  let tokenData = JSON.parse(body);
                  callback(null,tokenData);
              }
      })
  },function(tokenData,callback){ //获取微信用户信息
      let getInforUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${tokenData.access_token}&openid=${tokenData.openid}&lang=zh_CN`;
      request(getInforUrl,function (error,response,body) {
          if (!error && response.statusCode == 200) {
                let userData = JSON.parse(body);
                res.set("Access-Control-Allow-Origin","*") //设置解决跨域问题
                res.send(userData)
            }
    })
  }],function(err,result){
    if(err) throw err
  })

}
