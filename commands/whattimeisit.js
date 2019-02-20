const Composer = require('telegraf/composer')
const composer = new Composer()
const { randomInt } = require('../lib')

composer.command('whattimeisit', async ctx => {
  const { mongo: collection } = ctx
  const mccree = await collection('stickers').find({ type: 'mccree' }).exec()
  ctx.replyWithSticker(mccree[randomInt(0, mccree.length)].id, {
    reply_to_message_id: ctx.message.message_id
  })
})

module.exports = app => {
  app.use(composer.middleware())
}
