const Router = require('koa-router')
const { jssdk } = require('../controllers/jssdk')

const router = new Router()

router.get('/', jssdk)

module.exports = router