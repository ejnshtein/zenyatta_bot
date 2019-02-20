const Composer = require('telegraf/composer')
const composer = new Composer()
const { transformMessage } = require('../lib')

composer.action(/notarobot:(\S+)/i, async ctx => {
  const { mongo: collection, state: { chatConfig } } = ctx
  // console.log(ctx.match)
  if (/[0-9,]+/i.test(ctx.match[1])) {
    const userIds = ctx.match[1].match(/[0-9]+/ig).map(Number.parseInt)
    if (!userIds.includes(ctx.from.id)) {
      return ctx.answerCbQuery('This message does not apply to you.')
    }
    const user = await collection('robots').findOne({ chatId: ctx.chat.id, userId: ctx.from.id }).exec()
    if (user) {
      try {
        await ctx.restrictChatMember(ctx.from.id, {
          until_date: Math.round(Date.now() / 1000) + 10,
          can_send_messages: true,
          can_send_media_messages: true,
          can_add_web_page_previews: true
        })
      } catch (e) {
        return ctx.reply(e.description)
      }
      await user.remove()
      if (userIds.filter(id => id !== ctx.from.id).length > 0) {
        ctx.editMessageReplyMarkup({
          inline_keyboard: [
            [
              {
                text: 'I\'m not a robot.',
                callback_data: `notarobot:${userIds.filter(id => id !== ctx.from.id).join(',')}`
              }
            ]
          ]
        })
      } else {
        if (chatConfig && chatConfig.welcomeMessage) {
          return ctx.editMessageText(`${transformMessage(chatConfig.welcomeMessage.text, ctx.from)}`, chatConfig.welcomeMessage.extra)
        } else {
          try {
            await ctx.deleteMessage()
          } catch (e) {
            // ???
          }
        }
      }
    }
  }
})

module.exports = bot => {
  bot.use(composer.middleware())
}
