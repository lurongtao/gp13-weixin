const Router = require('koa-router')
const { hot, cate, detail, list, list2 } = require('../controllers/api')

const router = new Router()

router.get('/hot', hot)
router.get('/cate', cate)
router.get('/detail', detail)
router.get('/list', list)
router.get('/list2', list2)


module.exports = router