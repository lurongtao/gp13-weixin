const randomstring = require('randomstring')

exports.genTimestamp = () => {
  return Math.floor((new Date().getTime())/1000)
}

exports.nonceStr = () => {
  return randomstring.generate(32)
}