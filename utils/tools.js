const randomstring = require('randomstring')
const { get } = require('./http')
const { appId, appsecret } = require('../config/config')

exports.genTimestamp = () => {
  return Math.floor((new Date().getTime())/1000)
}

exports.nonceStr = () => {
  return randomstring.generate(32)
}

exports.getTicket = async () => {
  // 1、获取access_token
  let access_token_url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appsecret}`
  let { access_token } = await get(access_token_url)

  // 2、获取jsapi_ticket
  let jsapi_ticket_url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
  let { ticket } = await get(jsapi_ticket_url)

  return ticket
}