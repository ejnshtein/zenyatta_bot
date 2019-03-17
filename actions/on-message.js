const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyPublic, onlyAdmin, entityAdsDetector } = require('../middlewares')

composer.entity(entityAdsDetector, onlyPublic.isPublic, async (ctx, next) => {
  const { chatConfig } = ctx.state
  if (!chatConfig) return
  if (
    ctx.chat.isPublic &&
    !await onlyAdmin.isAdmin(ctx) &&
    !chatConfig.whitelist.includes(ctx.from.id)
  ) {
    try {
      await ctx.deleteMessage()
    } catch (e) {
      return ctx.reply(e.description)
    }
    await ctx.reply(
      `<a href="tg://user?id=${ctx.from.id}">${ctx.from.first_name} ${ctx.from.last_name ? ctx.from.last_name : ''}</a> нагадил.
Я конечно прибрался, но лучше подумай что ты натворил 😡`,
      {
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'DIE DIE DIE!',
                callback_data: `ban:user=${ctx.from.id}`
              },
              {
                text: 'Mercy him',
                callback_data: `mercy:user=${ctx.from.id}`
              }
            ]
          ]
        }
      })
  } else {
    next()
  }
})

composer.on('message', onlyPublic.isPublic, async (ctx, next) => {
  const { message, state: { chatConfig } } = ctx
  if (!chatConfig) return
  if (
    ctx.chat.isPublic &&
    (
      (
        message.forward_from_chat &&
        message.forward_from_chat.type === 'channel'
      ) ||
      (
        message.forward_from &&
        message.forward_from.is_bot === true
      )
    ) &&
    !await onlyAdmin.isAdmin(ctx) &&
    !chatConfig.whitelist.includes(ctx.from.id)
  ) {
    // await ctx.reply('Sending spam forbidden.')
    try {
      await ctx.deleteMessage()
    } catch (e) {
      return ctx.reply(e.description)
    }
  } else {
    next()
  }
})

module.exports = app => {
  app.use(composer.middleware())
}
