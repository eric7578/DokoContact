const express = require('express')
const oauth = require('../services/oauth2')

const router = express.Router()

router.get('/', function (req, res, next) {
  oauth.exchangeAccessToken(req.query.code)
    .then(tokens => {
      req.session.accessToken = tokens.access_token
      req.session.tokenType = tokens.token_type
      req.session.expiryDate = tokens.expiry_date
      res.end()
    })
})

module.exports = router
