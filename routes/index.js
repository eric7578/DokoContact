const express = require('express')
const wrapper = require('./wrapper')
const oauth = require('../services/oauth2')

const router = express.Router()

/* GET home page. */
router.get('/', redirectIfLogin, (req, res, next) => {
  res.render('index', {
    title: 'DokoContact',
    authUrl: oauth.getAuthUrl()
  })
})

router.get('/oauth2callback', redirectIfLogin, wrapper(async (req, res, next) => {
  const tokens = await oauth.exchangeAccessToken(req.query.code)
  req.session.accessToken = tokens.access_token
  req.session.tokenType = tokens.token_type
  req.session.expiryDate = tokens.expiry_date

  res.redirect('/search')
}))

router.get('/search', redirectIfNotLogin, (req, res) => {
  res.json(req.session)
})

function redirectIfLogin (req, res, next) {
  const { accessToken, expiryDate } = req.session
  if (accessToken && expiryDate > Date.now()) {
    res.redirect('/search')
  } else {
    res.session = null
    next()
  }
}

function redirectIfNotLogin (req, res, next) {
  const { accessToken, expiryDate } = req.session
  if (accessToken && expiryDate > Date.now()) {
    next()
  } else {
    res.session = null
    res.redirect('/')
  }
}

module.exports = router
