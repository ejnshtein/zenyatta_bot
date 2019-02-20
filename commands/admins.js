const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyPublic } = require('../middlewares')
const { sleep } = require('../lib')

composer.command('/admins', onlyPublic, async ctx => {
  if (ctx.chat.type === 'private') {
    return
  }
  const admins = (await ctx.getChatAdministrators())
    .filter(admin => admin.status !== 'creator' && !admin.user.is_bot)
    .map(
      admin =>
        `<a href="tg://user?id=${admin.user.id}">${admin.user.first_name} ${
          admin.user.last_name ? admin.user.last_name : ''
        }</a>`
    )
  await ctx.deleteMessage()
  await ctx.reply('Houston, we have a problem')
  if (!admins.length) {
    const { user } = (await ctx.getChatAdministrators()).find(el => el.status === 'creator')
    return ctx.reply(
      `<a href="tg://user?id=${user.id}">${user.first_name} ${user.last_name ? user.last_name : ''}</a>`,
      {
        parse_mode: 'HTML'
      }
    )
  }
  await sleep(2000)
  await ctx.reply('SUMMONING ALL ADMINS')
  await ctx.reply(admins.join(', '), {
    parse_mode: 'HTML'
  })
})

module.exports = app => {
  app.use(composer.middleware())
}
