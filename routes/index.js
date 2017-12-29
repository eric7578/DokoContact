const express = require('express')
const wrapper = require('./wrapper')
const oauth = require('../services/oauth2')
const contactGroup = require('../services/contactGroup')

const router = express.Router()

const redirectIfLogin = wrapper(async (req, res, next) => {
  const isValid = await oauth.checkToken(req.session)
  if (isValid) {
    res.redirect('/search')
  } else {
    res.session = null
    next()
  }
})

const redirectIfNotLogin = wrapper(async (req, res, next) => {
  const isValid = await oauth.checkToken(req.session)
  if (isValid) {
    next()
  } else {
    res.session = null
    res.redirect('/')
  }
})

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

router.get('/search', redirectIfNotLogin, wrapper(async (req, res) => {
  const contactGroups = await contactGroup.getContactGroups(req.session)
  res.render('search', {
    title: 'DokoContact',
    contactGroups
  })
}))

if (process.env.NODE_ENV === 'development') {
  router.get('/peek', redirectIfNotLogin, (req, res) => {
    res.json(req.session)
  })
}

module.exports = router
