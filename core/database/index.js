const mongoose = require('mongoose')
const { Schema } = mongoose
const connection = mongoose.createConnection(process.env.MONGO_URL, {
  useNewUrlParser: true
})

connection.then(() => {
  console.log('DB connected')
})
connection.catch(err => {
  console.log('DB connection ERROR', err)
})

const collections = [
  {
    name: 'lennys',
    schema: new Schema({
      text: String
    })
  }, {
    name: 'answers',
    schema: new Schema({
      type: String,
      text: String
    })
  }, {
    name: 'blackwords',
    schema: new Schema({
      word: String
    })
  }, {
    name: 'stickers',
    schema: new Schema({
      type: String,
      id: String
    })
  }, {
    name: 'adminstickers',
    schema: new Schema({
      id: String,
      text: String
    })
  }, {
    name: 'robots',
    schema: new Schema({
      userId: Number,
      chatId: Number,
      date: {
        type: Date,
        required: false,
        default: () => Date.now() + 172800000
      },
      banned: {
        type: Boolean,
        default: false
      }
    }, {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    })
  }, {
    name: 'chats',
    schema: new Schema({
      id: {
        type: Number,
        unique: true,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      username: {
        type: String,
        required: false
      },
      welcomeMessage: {
        type: {
          text: {
            type: String,
            default: `Приветствую тебя, <a href="tg://user?id=$userId">$userFirstName</a>!\nПеред тем как писать в чат, рекомендую ознакомиться с правилами.\nЕсли вкратце, всё в рамках 12+.`
          },
          extra: {
            type: Object,
            default: {}
          }
        },
        required: false
      },
      whitelist: {
        type: Array,
        default: [],
        required: true
      },
      customLinks: {
        type: {
          text: {
            type: String,
            default: 'Полезные ссылочки таверны.'
          },
          extra: {
            type: Object,
            default: {}
          }
        },
        required: false
      }
    })
  },
  {
    name: 'requestchats',
    schema: new Schema({
      id: Number,
      title: String,
      username: {
        type: String,
        required: false
      }
    }, {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
      }
    })
  }
]

collections.forEach(collection => {
  if (collection.pre) {
    Object.keys(collection.pre).forEach(preKey => {
      collection.schema.pre(preKey, collection.pre[preKey])
    })
  }
  if (collection.method) {
    collection.schema.method(collection.method)
  }
  connection.model(collection.name, collection.schema)
})

module.exports = (collectionName) => {
  const collection = collections.find(el => el.name === collectionName)
  if (!collection) {
    throw new Error(`Collection not found: ${collectionName}`)
  }
  return connection.model(collectionName, collection.schema)
}
