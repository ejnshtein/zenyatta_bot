const Telegraf = require('telegraf').default
const bot = new Telegraf(process.env.BOT_TOKEN)
const cron = require('node-schedule')
const collection = require('./database')
const logger = require('./database/logger')
// const middleware = require('./database/middleware')
cron.scheduleJob('* 0-23 * * *', async () => {
  // check each hour
  const robots = await collection('robots')
    .find({ date: { $lte: Date.now() }, banned: { $not: { $eq: true } } })
    .exec()
  if (robots.length) {
    for (const robot of robots) {
      try {
        await bot.telegram.kickChatMember(robot.chatId, robot.userId)
      } catch (e) {
        continue
      }
      robot.banned = true
      robot.markModified('banned')
      await robot.save()
    }
  }
})

bot.telegram.getMe()
  .then(botInfo => {
    bot.options.username = botInfo.username
  })

bot.context.mongo = collection

bot.use(logger())

module.exports = {
  bot
}

bot.startPolling()

console.log('Bot started')
