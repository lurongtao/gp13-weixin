const Koa = require('koa')
const fs = require('fs')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const path = require('path')
const views = require('koa-views')

// 加载模板引擎
app.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

app.use(bodyParser())

const Router = require('koa-router')
const home = require('./router/weixin')
const jssdk = require('./router/jssdk')

// 装载所有子路由
let router = new Router()
router.use('/', home.routes(), home.allowedMethods())
router.use('/jssdk', jssdk.routes(), jssdk.allowedMethods())

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods())

app.listen(3333, () => {
  console.log('[demo] route-use-middleware is starting at port 3333')
})