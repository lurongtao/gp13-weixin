const querystring = require('querystring')
const crypto = require('crypto')
const { appId, appsecret, url } = require('../config/config')
const { get } = require('../utils/http')
const { genTimestamp, nonceStr } = require('../utils/tools')

exports.jssdk = async (ctx, next) => {
  // 1、获取access_token
  let access_token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appsecret}`
  let { access_token } = await get(access_token_url)

  // 2、获取jsapi_ticket
  let jsapi_ticket_url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
  let { ticket } = await get(jsapi_ticket_url)
  
  // 3、生成string1
  let obj = {
    noncestr: nonceStr(),
    timestamp: genTimestamp(),
    jsapi_ticket: ticket,
    url
  }

  let sortedObj = Object.keys(obj).sort().reduce((tempObj, key) => {
    tempObj[key] = obj[key]
    return tempObj
  }, {})

  let string1 = querystring.stringify(sortedObj, null, null, {
    encodeURIComponent: (str) => querystring.unescape(str)
  })
  
  // 4、生成signature
  let signature =  crypto.createHash('sha1').update(string1).digest('hex')

  await ctx.render('sign', {
    appId,
    timestamp: obj.timestamp,
    nonceStr: obj.noncestr,
    signature
  })

  ctx.set('Content-Type', 'application/json;charset=utf8')
}