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
const helmet = require('helmet')
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

app.use(helmet())

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

if (process.env.NODE_ENV === 'development') {
  app.get('/whoami', ensureLoggedIn('/'), (req, res) => {
    res.json(req.user)
  })
}

app.use('/search', ensureLoggedIn('/'), search)
app.use('/maps', maps)
app.use('/contacts', ensureLoggedIn('/'), contacts)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  err.status = err.status || 500
  if (process.env.NODE_ENV !== 'development') {
    err.stack = ''
    err.message = 'Something happend!'
  }
  res.render('error', {
    error: err
  })
})

module.exports = app
