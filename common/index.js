const collection = require('../core/database')

module.exports = bot => {
  collection('requestchats').watch().on('change', data => {
    if (data.operationType === 'insert') {
      const chat = data.fullDocument
      bot.telegram.sendMessage(process.env.ADMIN_ID,
        `Chat "${chat.title}" - <code>${chat.id}</code> want to join our journey.\nApprove?`,
        {
          parse_mode: 'HTML'
        })
    }
  })
}
