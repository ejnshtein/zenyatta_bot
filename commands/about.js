const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyPublic } = require('../middlewares')

composer.command('about',
  Composer.branch(
    onlyPublic,
    (_, next) => next(),
    Composer.reply('I dreamt I was a butterfly')
  )
)

module.exports = app => {
  app.use(composer.middleware())
}
