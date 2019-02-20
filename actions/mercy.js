const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyAdmin, onlyPublic } = require('../middlewares')

composer.action(/^mercy:user=(\S+)$/i, onlyPublic, onlyAdmin, async ctx => {
  const { chatConfig } = ctx.state
  if (!chatConfig) return
  chatConfig.whitelist.push(Number.parseInt(ctx.match[1]))
  chatConfig.markModified('whitelist')
  await chatConfig.save()
  ctx.answerCbQuery('You have mercy on him')
  ctx.editMessageText('Be one with the universe. @')
})

module.exports = app => {
  app.use(composer.middleware())
}
