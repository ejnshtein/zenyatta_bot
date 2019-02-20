const Composer = require('telegraf/composer')
const composer = new Composer()
const { randomInt } = require('../lib')

composer.command('rate', async (ctx, next) => {
  if (ctx.message.reply_to_message) {
    const { mongo: collection } = ctx
    const rates = await collection('answers').find({ type: 'rate' }).exec()
    ctx.reply(rates[randomInt(0, rates.length)].text, {
      reply_to_message_id: ctx.message.reply_to_message.message_id
    })
  } else {
    next()
  }
})

composer.hears(/\/rate ([\s\S]+)/i, async ctx => {
  const { mongo: collection } = ctx
  const rates = await collection('answers').find({ type: 'rate' }).exec()
  ctx.reply(rates[randomInt(0, rates.length)].text, {
    reply_to_message_id: ctx.message.message_id
  })
})

module.exports = app => {
  app.use(composer.middleware())
}
