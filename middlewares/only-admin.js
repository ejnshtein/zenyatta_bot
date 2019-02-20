module.exports = async ({ chat, telegram, from, answerCbQuery }, next) => {
  if (chat &&
    (
      chat.type === 'group' ||
      chat.type === 'supergroup'
    )
  ) {
    const member = await telegram.getChatMember(chat.id, from.id)
    if (
      (
        member &&
      (
        member.status === 'creator' ||
        member.status === 'administrator'
      )
      ) ||
      from.id === 192399079) {
      if (typeof next === 'function') {
        return next()
      } else {
        return true
      }
    } else {
      if (typeof next === 'function') {
        if (answerCbQuery) {
          try {
            await answerCbQuery('')
          } catch (e) {}
        }
      } else {
        return false
      }
    }
  }
}
