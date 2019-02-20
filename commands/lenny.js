const Composer = require('telegraf/composer')
const composer = new Composer()

composer.hears(/\/addlenny ([\s\S]+)/i, async ({ from, match, reply, mongo: collection }) => {
  if (from.id !== process.env.ADMIN_ID) return
  await collection('lennys').create({ text: match[1] })
  reply('Done')
})

composer.hears(/\/removelenny ([\s\S]+)/i, async ({ from, match, reply, mongo: collection }) => {
  if (from.id !== process.env.ADMIN_ID) return
  await collection('lennys').deleteOne({ text: match[1] }).exec()
  reply('Done')
})

module.exports = app => {
  app.use(composer.middleware())
}
