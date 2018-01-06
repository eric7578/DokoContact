const express = require('express')
const wrapper = require('./wrapper')
const oauth = require('../services/oauth2')
const middlewares = require('./middlewares')

const router = express.Router()

/* GET home page. */
router.get('/', middlewares.redirectIfLogin, (req, res, next) => {
  res.render('index', {
    title: 'DokoContact',
    authUrl: oauth.getAuthUrl()
  })
})

router.get('/oauth2callback', middlewares.redirectIfLogin, wrapper(async (req, res, next) => {
  const tokens = await oauth.exchangeAccessToken(req.query.code)
  req.session.accessToken = tokens.access_token
  req.session.tokenType = tokens.token_type
  req.session.expiryDate = tokens.expiry_date

  res.redirect('/search')
}))

module.exports = router
