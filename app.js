require('dotenv').config()

const express = require('express')
const path = require('path')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const _ = require('lodash')
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login')
const search = require('./routes/search')
const maps = require('./routes/maps')
const contacts = require('./routes/contacts')

passport.use(new GoogleStrategy({
  clientID: process.env.OAUTH_ID,
  clientSecret: process.env.OAUTH_SECRET,
  callbackURL: process.env.REDIRECT_URL
}, (token, tokenSecret, profile, done) => {
  const user = {
    id: profile.id,
    displayName: profile.displayName,
    photos: _.get(profile, 'photos[0].value'),
    token
  }
  done(null, user)
}))

passport.serializeUser((user, cb) => {
  cb(null, user)
})

passport.deserializeUser((user, cb) => {
  cb(null, user)
})

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

app.use(passport.initialize())
app.use(passport.session())

app.get('/', ensureLoggedOut('/search'), (req, res, next) => {
  res.render('index', {
    title: 'DokoContact'
  })
})

app.get('/auth/google', passport.authenticate('google', {
  scope: [
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]
}))

app.get('/oauth2callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/search');
})

app.use(ensureLoggedIn('/'))

if (process.env.NODE_ENV === 'development') {
  app.get('/whoami', (req, res) => {
    res.json(req.user)
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
  if (err.status) {
    res.status(err.status)
    res.render('error')
  } else {
    req.logout()
    res.redirect('/')
  }
})

module.exports = app
