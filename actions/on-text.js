const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyPublic } = require('../middlewares')

composer.on('text',
  Composer.branch(
    onlyPublic,
    async (ctx, next) => {
      const { mongo: collection } = ctx
      const words = await collection('blackwords')
        .find({
          word: {
            $in: ctx.message.text
              .toLowerCase()
              .split(' ')
          }
        })
      if (words.length) {
        try {
          await ctx.deleteMessage()
        } catch (e) {}
      } else {
        next()
      }
    },
    (ctx, next) => next()
  )
)

module.exports = app => {
  app.use(composer.middleware())
}
