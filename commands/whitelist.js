const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyAdmin, onlyPublic } = require('../middlewares')

composer.command('addwhite',
  onlyPublic,
  onlyAdmin,
  async ctx => {
    if (ctx.message.reply_to_message) {
      const { chatConfig } = ctx.state
      if (!chatConfig) return
      const inWhitelist = chatConfig.whitelist.includes(ctx.message.reply_to_message.from.id)
      if (inWhitelist) {
        ctx.reply('This user already in whitelist')
      } else {
        chatConfig.whitelist.push(ctx.message.reply_to_message.from.id)
        chatConfig.markModified('whitelist')
        await chatConfig.save()
        ctx.reply('Done.')
      }
    } else {
      ctx.reply('Maybe you forget to reply?')
    }
  })

composer.command('removewhite',
  onlyPublic,
  onlyAdmin,
  async ctx => {
    if (ctx.message.reply_to_message) {
      const { chatConfig } = ctx.state
      if (!chatConfig) return
      const inWhitelist = chatConfig.whitelist.includes(ctx.message.reply_to_message.from.id)
      if (inWhitelist) {
        chatConfig.whitelist = chatConfig.whitelist.filter(el => el !== ctx.message.reply_to_message.from.id)
        chatConfig.markModified('whitelist')
        await chatConfig.save()
        ctx.reply('Done.')
      } else {
        ctx.reply(`This user isn't in whitelist`)
      }
    } else {
      ctx.reply('Maybe you forget to reply?')
    }
  })

module.exports = app => {
  app.use(composer.middleware())
}
