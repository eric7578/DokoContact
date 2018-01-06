require('dotenv').config()

const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const index = require('./routes/index')
const search = require('./routes/search')
const maps = require('./routes/maps')
const contacts = require('./routes/contacts')
const middlewares = require('./routes/middlewares')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
if (process.env.NODE_ENV === 'development') {
  app.locals.pretty = true;
}

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cookieSession({
  secret: process.env.SESSION_SECRET,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', index)

app.use(middlewares.redirectIfNotLogin)

if (process.env.NODE_ENV === 'development') {
  app.get('/peek', (req, res) => {
    res.json(req.session)
  })
}

app.use('/search', search)
app.use('/maps', maps)
app.use('/contacts', contacts)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
