const express = require('express')
const oauth = require('../services/oauth2')

const router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'DokoContact',
    authUrl: oauth.getAuthUrl()
  })
})

module.exports = router
