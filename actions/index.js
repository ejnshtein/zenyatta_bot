module.exports = app => {
  require('./request-chat')(app)
  require('./inline-query')(app)
  require('./ban')(app)
  require('./mercy')(app)
  require('./new-chat-members')(app)
  require('./notarobot')(app)
  require('./on-sticker')(app)
  require('./on-text')(app)
  require('./on-message')(app)
}
