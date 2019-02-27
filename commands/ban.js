const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyAdmin, onlyPublic } = require('../middlewares')

composer.hears(
  [/^\/ban\b(@\S+)?$/ig, '!ban', '!бан', '!spam', '!спам'],
  onlyPublic,
  Composer.branch(
    onlyAdmin,
    async ctx => {
      if (ctx.message.reply_to_message) {
        try {
          await ctx.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id)
          await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.reply_to_message.message_id)
          await ctx.deleteMessage()
        } catch (e) {
          return ctx.reply(e.description)
        }
      } else {
        ctx.reply('To ban someone reply to user message with this command')
      }
    },
    async ctx => ctx.reply(`Who, non-admin, decided to tell me what to do?`, {
      reply_to_message_id: ctx.message.message_id
    }))
)

module.exports = app => {
  app.use(composer.middleware())
}
