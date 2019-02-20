module.exports = ({ chat }, next) => {
  if (chat.type === 'group' || chat.type === 'supergroup') {
    if (typeof next === 'function') {
      next()
    } else {
      return true
    }
  }
}
module.exports.isPublic = (ctx, next) => {
  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    ctx.chat.isPublic = true
  } else {
    ctx.chat.isPublic = false
  }
  if (typeof next === 'function') {
    next()
  } else {
    return ctx.chat.isPublic
  }
}
