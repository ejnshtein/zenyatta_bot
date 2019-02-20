const Composer = require('telegraf/composer')
const composer = new Composer()

composer.on('sticker', async ctx => {
  const { mongo: collection } = ctx
  const sticker = await collection('adminstickers').findOne({ id: ctx.message.sticker.file_id }).exec()
  if (sticker) {
    ctx.reply(sticker.text, {
      parse_mode: 'HTML'
    })
  }
})

module.exports = app => {
  app.use(composer.middleware())
}
