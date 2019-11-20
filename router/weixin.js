const crypto = require('crypto')
const Router = require('koa-router')
var contentType = require('content-type')
var getRawBody = require('raw-body')
var convert = require('xml-js')

let home = new Router()

// 子路由1
home.get('auth', async ( ctx )=>{
  const token = 'weixin'
  let { signature, timestamp, nonce, echostr } = ctx.query
  let str1 = [timestamp, nonce, token].sort().join('')
  let hashed = crypto.createHash('sha1').update(str1).digest('hex')
  if (hashed === signature) {
    ctx.body = echostr
  } else {
    ctx.body = '没有权限'
  }
})

home.post('auth', async (ctx) => {
  // req 一定要是原生http的req,不能是koa的ctx.request
  const xml = (await getRawBody(ctx.req, {
    length: ctx.req.headers['content-length'],
    limit: '1mb',
    encoding: contentType.parse(ctx.req).parameters.charset
  })).toString()

  let result = convert.xml2js(xml, {
    compact: true,
    cdataKey: 'data',
    textKey: 'data'
  }).xml

  let {
    ToUserName,
    FromUserName,
    CreateTime,
    MsgType,
    Content,
    MsgId
  } = Object.keys(result).reduce((obj, key) => {
    obj[key] = result[key]['data']
    return obj
  }, {})

  await ctx.render('autoreply', {
    ToUserName: FromUserName,
    FromUserName: ToUserName,
    CreateTime: new Date().getTime(),
    Content: '<a href="https://www.baidu.com">百度</a>'
  })
})

module.exports = home