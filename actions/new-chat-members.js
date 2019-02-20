const Composer = require('telegraf/composer')
const composer = new Composer()
const { templateDetector } = require('../middlewares')

composer.on('new_chat_members', templateDetector, async ctx => {
  const { mongo: collection, message: { new_chat_members } } = ctx
  if (new_chat_members.some(el => el.is_bot)) {
    const member = await ctx.getChatMember(ctx.from.id)
    if (member && (member.status === 'creator' || member.status === 'administrator')) {
      return
    }
  }
  const captchaMessage = await ctx.reply('Confirm that you are not a robot.', {
    reply_to_message_id: ctx.message.message_id,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'I\'m not a robot.',
            callback_data: `notarobot:${ctx.message.new_chat_members.map(user => user.id).join(',')}`
          }
        ]
      ]
    }
  })
  for (const member of new_chat_members) {
    const user = await collection('robots').findOne({
      userId: member.id,
      chatId: ctx.chat.id
    }).exec()
    if (!user) {
      const config = {
        userId: member.id,
        chatId: ctx.chat.id,
        tgUser: member,
        joinMessageId: ctx.message.message_id,
        captchaMessageId: captchaMessage.message_id
      }
      if (member.template) {
        config.date = Date.now() + 3600000
      }
      try {
        await ctx.restrictChatMember(member.id, {
          until_date: Math.round(Date.now() / 1000) + 10, // forever
          can_send_messages: false,
          can_send_media_messages: false,
          can_add_web_page_previews: false
        })
      } catch (e) {
        return ctx.reply(e.description)
      }
      await collection('robots').create(config) // will be banned in 1 day OR if template detected in 1 hour, see ./database/mongodb/schemas.js
    }
  }
})

module.exports = bot => {
  bot.use(composer.middleware())
}
