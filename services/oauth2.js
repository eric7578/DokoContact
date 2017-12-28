const google = require('googleapis')

const getOAuthClient = () => new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
)

const getAuthUrl = () => {
  const oauth2 = getOAuthClient()
  return oauth2.generateAuthUrl({
    scope: 'https://www.googleapis.com/auth/contacts.readonly'
  })
}

const exchangeAccessToken = code => new Promise((resolve, reject) => {
  const oauth2 = getOAuthClient()
  oauth2.getToken(code, (err, tokens) => {
    if (err) {
      reject(err)
    } else {
      oauth2.credentials = tokens
      resolve(tokens)
    }
  })
})

module.exports = {
  getOAuthClient,
  getAuthUrl,
  exchangeAccessToken
}