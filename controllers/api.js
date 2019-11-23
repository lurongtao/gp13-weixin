let fs = require('fs')
let path = require('path')

exports.hot = async (ctx) => {
  await ctx.render('./data/cookbook-category-hot')
  ctx.set('Content-Type', 'application/json;charset=utf8')
}

exports.cate = async (ctx) => {
  await ctx.render('./data/cookbook-category')
  ctx.set('Content-Type', 'application/json;charset=utf8')
}

exports.detail = async (ctx) => {
  await ctx.render('./data/cookbook-detail')
  ctx.set('Content-Type', 'application/json;charset=utf8')
}

exports.list = async (ctx) => {
  await ctx.render('./data/cookbook-list')
  ctx.set('Content-Type', 'application/json;charset=utf8')
}

exports.list2 = async (ctx) => {
  let { _page, _limit } = ctx.query
  let start = (~~_page - 1) * ~~_limit
  let result = fs.readFileSync(path.resolve(__dirname, '../models/data/cookbook-list-2.ejs')).toString()
  let data = JSON.parse(result).data
  ctx.body = data.splice(start, ~~_limit)
  ctx.set('Content-Type', 'application/json;charset=utf8')
}