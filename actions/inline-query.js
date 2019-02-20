const Composer = require('telegraf/composer')
const composer = new Composer()

composer.inlineQuery(/^lenny$/i, async ctx => {
  if (ctx.inlineQuery.offset === '0') return ctx.answerInlineQuery([])
  const lennys = await ctx.mongo('lennys').find().exec()
  return ctx.answerInlineQuery(
    lennys.map(
      (lenny, id) => ({
        type: 'article',
        id,
        title: lenny.text,
        input_message_content: {
          message_text: lenny.text
        }
      })
    ),
    {
      next_offset: '0'
    }
  )
})

module.exports = app => {
  app.use(composer.middleware())
}
