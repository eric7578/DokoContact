const express = require('express')
const wrapper = require('./wrapper')
const oauth = require('../services/oauth2')

const router = express.Router()

router.get('/', wrapper(async (req, res, next) => {
  const tokens = await oauth.exchangeAccessToken(req.query.code)
  req.session.accessToken = tokens.access_token
  req.session.tokenType = tokens.token_type
  req.session.expiryDate = tokens.expiry_date

  const userInfo = await oauth.getUserInfo(req.session)
  res.json(Object.assign(req.session, userInfo))
}))

module.exports = router
