module.exports = () => async ({ chat, mongo, state }, next) => {
  if (
    chat &&
    (
      chat.type === 'group' ||
      chat.type === 'supergroup'
    )
  ) {
    const chatConfig = await mongo('chats').findOne({ id: chat.id }).exec()
    if (chatConfig) {
      state.chatConfig = chatConfig
    }
  }
  return next()
}
