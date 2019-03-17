const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyAdmin } = require('../middlewares')

composer.action(/^ban:user=(\S+)$/i, onlyAdmin, async ctx => {
  const userId = ctx.match[2]
  try {
    await ctx.telegram.kickChatMember(ctx.chat.id, userId)
  } catch (e) {
    return ctx.reply(e.message)
  }
  ctx.answerCbQuery('Banned forever.')
  ctx.editMessageText(`We're done here.`)
})

module.exports = app => {
  app.use(composer.middleware())
}
