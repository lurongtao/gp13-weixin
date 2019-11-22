const Router = require('koa-router')
const { auth, autoreply } = require('../controllers/weixin')

let home = new Router()

// 子路由1
home.get('auth', auth)

home.post('auth', autoreply)

module.exports = home