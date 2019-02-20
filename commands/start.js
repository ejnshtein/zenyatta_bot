const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyPublic } = require('../middlewares')

composer.start(onlyPublic,
  Composer.reply(
    `Здравствуй герой!
Я <a href="https://overwatch.gamepedia.com/Zenyatta">Дзенъятта</a>, или просто Дзен для тебя.
Я создан чтобы направлять на путь истинный омников и людей.
Моя основная задача это поддерживать мир и гармонию в нашем уютном чате @tavernofoverwatch

Be one with the universe @`,
    {
      parse_mode: 'HTML',
      disable_web_page_preview: true
    }
  )
)

module.exports = app => {
  app.use(composer.middleware())
}
