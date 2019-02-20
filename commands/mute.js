const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyAdmin } = require('../middlewares')

composer.command('/mute', onlyAdmin, async ctx => {
  if (ctx.chat.type !== 'private') {
    if (ctx.message.reply_to_message) {
      await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.reply_to_message.message_id)
      await ctx.telegram.restrictChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id, {
        until_date: Math.round(Date.now() / 1000) + 86400,
        can_send_messages: false
      })
      await ctx.deleteMessage()
      ctx.replyWithHTML(
        `User <a href="tg://user?id=${ctx.message.reply_to_message.from.id}">${
          ctx.message.reply_to_message.from.first_name
        }</a> has been muted for 24h`
      )
    } else {
      ctx.reply('Maybe you forget to reply?')
    }
  }
})

module.exports = app => {
  app.use(composer.middleware())
}
