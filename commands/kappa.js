const Composer = require('telegraf/composer')
const composer = new Composer()
const { randomInt } = require('../lib')

composer.hears([/kappa/i, /карра/i, /каппа/i], async ctx => {
  const { mongo: collection } = ctx
  const kappa = await collection('stickers').find({ type: 'kappa' }).exec()
  ctx.replyWithSticker(kappa[randomInt(0, kappa.length)].id)
})

module.exports = app => {
  app.use(composer.middleware())
}
