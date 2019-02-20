require('./env')
const { bot } = require('./core/bot')
require('./commands')(bot)
require('./actions')(bot)
require('./common')(bot)

// const { mongodb, nedb } = require('./core/database')
// const { sleep } = require('./lib')
// !(async () => {
//   await sleep(3000)
//   nedb('stickers').find().then(async result => {
//     console.log(result)
//     const res = await mongodb('stickers').create(result.map(({ id, command }) => ({ type: command, id })))
//     console.log(res)
//   })
// })()
