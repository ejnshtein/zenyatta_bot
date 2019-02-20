const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyAdmin } = require('../middlewares')

composer.command('/clear', onlyAdmin, async ctx => {
  if (ctx.chat.type !== 'private') {
    if (ctx.message.reply_to_message) {
      await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.reply_to_message.message_id)
      await ctx.deleteMessage()
    }
  }
})

module.exports = app => {
  app.use(composer.middleware())
}
