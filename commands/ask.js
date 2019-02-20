const Composer = require('telegraf/composer')
const composer = new Composer()
const { randomInt } = require('../lib')

composer.command('ask', async (ctx, next) => {
  if (ctx.message.reply_to_message) {
    const { mongo: collection } = ctx
    const asks = await collection('answers').find({ type: 'ask' }).exec()
    ctx.reply(asks[randomInt(0, asks.length)].text, {
      reply_to_message_id: ctx.message.reply_to_message.message_id
    })
  } else {
    next()
  }
})

composer.hears(/\/ask ([\s\S]+)/i, async ctx => {
  const { mongo: collection } = ctx
  const asks = await collection('answers').find({ type: 'ask' }).find().exec()
  ctx.reply(asks[randomInt(0, asks.length)].text, {
    reply_to_message_id: ctx.message.message_id
  })
})

module.exports = app => {
  app.use(composer.middleware())
}
