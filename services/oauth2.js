const google = require('googleapis')
const axios = require('axios')

const getOAuthClient = () => new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
)

const getAuthUrl = () => {
  const oauth2 = getOAuthClient()
  return oauth2.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/contacts.readonly',
      'https://www.googleapis.com/auth/userinfo.profile'
    ]
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

const getUserInfo = tokens => {
  return axios
    .get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`
      }
    })
    .then(response => response.data)
}

const checkToken = tokens => {
  if (tokens && tokens.accessToken) {
    return axios
      .get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${tokens.accessToken}`)
      .then(response => response.status === 200)
      .catch(err => Promise.resolve(false))
  } else {
    return Promise.resolve(false)
  }
}

module.exports = {
  getOAuthClient,
  getAuthUrl,
  exchangeAccessToken,
  getUserInfo,
  checkToken
}