const defaultLinks = [
  [
    {
      'text': 'VK',
      'url': 'https://vk.com/tavernofoverwatch'
    }, {
      'text': 'YouTube',
      'url': 'https://www.youtube.com/user/tavernofheroes'
    }
  ],
  [
    {
      'text': 'Instagram',
      'url': 'https://www.instagram.com/tavernofoverwatch'
    }, {
      'text': 'Discord',
      'url': 'https://discord.gg/tavernofheroes'
    }
  ],
  [
    {
      'text': 'Стикеры',
      'url': 'https://t.me/addstickers/tavernOfOverwatch'
    }, {
      'text': 'Сайт',
      'url': 'https://overwatch.tavernofheroes.net/ru'
    }
  ],
  [
    {
      'text': 'Tavern of Overwatch | Новости',
      'url': 'https://t.me/tavernofoverwatchnews'
    }
  ],
  [
    {
      'text': 'Tavern of Heroes | Новости',
      'url': 'https://t.me/tavern_of_heroes'
    }
  ],
  [
    {
      'text': 'Tavern of Heroes | Patreon',
      'url': 'https://www.patreon.com/tavernofheroes'
    }
  ]
]
const Composer = require('telegraf/composer')
const composer = new Composer()
const { onlyPublic } = require('../middlewares')

composer.command('links',
  Composer.branch(
    onlyPublic,
    async ctx => {
      const { chatConfig } = ctx.state
      if (chatConfig && chatConfig.customLinks) {
        return ctx.reply(chatConfig.customLinks.text, chatConfig.customLinks.extra)
      } else {
        return ctx.reply('Usefull links:', {
          reply_markup: {
            inline_keyboard: defaultLinks
          }
        })
      }
    },
    async ctx => {
      return ctx.reply('Usefull links:', {
        reply_markup: {
          inline_keyboard: defaultLinks
        }
      })
    }
  )
)

module.exports = app => {
  app.use(composer.middleware())
}
