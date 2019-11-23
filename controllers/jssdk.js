const querystring = require('querystring')
const crypto = require('crypto')
const { query } = require('../utils/db')
const { url } = require('../config/config')
const { appId} = require('../config/config')
const { genTimestamp, nonceStr, getTicket } = require('../utils/tools')

exports.jssdk = async (ctx, next) => {

  let sql = 'select * from ticket'
  let result = await query(sql)
  let ticket = ''
  if (result.length > 0) {
    if (new Date().getTime() - parseInt(result[0]['create_time'], 10) > 7000000) {
      ticket = await getTicket()
      let sql = 'update ticket set ticket = ?, create_time = ? where id = ?'
      let values = [ticket, new Date().getTime(), result[0]['id']]
      await query(sql, values)
    }
  } else {
    ticket = await getTicket()
    let sql = 'insert into ticket(ticket, create_time) values(?, ?)'
    let values = [ticket, new Date().getTime()]
    await query(sql, values)
  }

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
  let signature = crypto.createHash('sha1').update(string1).digest('hex')

  await ctx.render('sign', {
    appId,
    timestamp: obj.timestamp,
    nonceStr: obj.noncestr,
    signature
  })

  ctx.set('Content-Type', 'application/json;charset=utf8')
}