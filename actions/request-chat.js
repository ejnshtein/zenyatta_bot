const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyAdmin, onlyPublic } = require('../middlewares')

composer.action(/^requestchat$/,
  onlyPublic,
  Composer.branch(
    onlyAdmin,
    async ctx => {
      const { mongo: collection } = ctx
      const chat = await collection('requestchats').findOne({ id: ctx.chat.id }).exec()
      if (chat) {
        return ctx.answerCbQuery('This chat already requested to this bot.')
      } else {
        await collection('requestchats').create({
          id: ctx.chat.id,
          title: ctx.chat.title,
          username: ctx.chat.username ? ctx.chat.username : undefined
        })
        ctx.answerCbQuery('OK')
        ctx.deleteMessage()
      }
    },
    async ctx => ctx.answerCbQuery(`You aren't admin of this chat.`)
  ))

composer.command('requestchat',
  onlyPublic,
  async ctx => {
    const { mongo: collection } = ctx
    const chat = await collection('requestchats').findOne({ id: ctx.chat.id }).exec()
    if (chat) {
      return ctx.reply('This chat already requested to this bot.')
    } else {
      return ctx.reply('Do you want to request this chat?', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Yeah',
                callback_data: `requestchat`
              }
            ]
          ]
        }
      })
    }
  }
)

composer.action(/^requestedchat=(\S+):chatid=(\S+)$/i,
  async (ctx, next) => {
    if (ctx.from.id === process.env.ADMIN_ID) {
      return next()
    }
  },
  async ctx => {
    console.log('a')
    const { mongo: collection } = ctx
    switch (ctx.match[1]) {
      case 'approve':
        const chat = await collection('requestchats').findOne({ id: Number(ctx.match[2]) }).exec()
        const chatData = Object.create(chat.toObject())
        delete chatData._id
        try {
          await collection('chats').create(chatData)
        } catch (e) {
          console.log(e)
          return ctx.answerCbQuery(e.description)
        }
        ctx.deleteMessage()
        return ctx.answerCbQuery('Done')
      case 'decline':
        await collection('requestchats').deleteOne({ id: Number(ctx.match[2]) }).exec()
        ctx.deleteMessage()
        return ctx.answerCbQuery('Done')
    }
  })

composer.hears(/^\/addchat (-?[0-9]+)$/i,
  async (ctx, next) => {
    if (ctx.from.id === process.env.ADMIN_ID) {
      return next()
    }
  },
  async ctx => {
    const { mongo: collection } = ctx
    const chat = await collection('requestchats').findOne({ id: Number(ctx.match[1]) }).exec()
    const chatData = chat.toObject()
    delete chatData._id
    try {
      await collection('chats').create(chatData)
    } catch (e) {
      console.log(e)
      return ctx.reply(e.description)
    }
    await chat.remove()
    return ctx.reply('Done')
  })

composer.command('requestedchats',
  async (ctx, next) => {
    if (ctx.from.id === process.env.ADMIN_ID) {
      return next()
    }
  },
  async ctx => {
    const { mongo: collection } = ctx
    const chats = await collection('requestchats').find().exec()
    return ctx.reply(
      `Here's ${chats.length} chats that wants to join us.
And here's list:\n${chats.map(({ id, title, username }) => `"${title}" - <code>${id}</code>${username ? ` - @${username}` : ''}`).join('\n')}`,
      {
        parse_mode: 'HTML'
      })
  })

module.exports = app => {
  app.use(composer.middleware())
}
