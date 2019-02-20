const Composer = require('telegraf/composer')
const composer = new Composer()

composer.command('getid', ctx => {
  ctx.replyWithHTML(
    `Your id: <code>${ctx.from.id}</code>
Chat id: <code>${ctx.chat.id}</code>`
  )
})

module.exports = app => {
  app.use(composer.middleware())
}
