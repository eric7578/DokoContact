const express = require('express')
const google = require('googleapis')

const router = express.Router()
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
)

/* GET home page. */
router.get('/', function (req, res, next) {
  const authUrl = oauth2Client.generateAuthUrl({
    scope: 'https://www.googleapis.com/auth/contacts.readonly'
  })

  res.render('index', {
    title: 'DokoContact',
    authUrl
  })
})

module.exports = router
