const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO)
mongoose.Promise = global.Promise
mongoose.connection.on('connected', () => {
  console.log('connected.')
})

exports.Map = require('./Map')
