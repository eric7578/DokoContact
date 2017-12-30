const wrapper = require('./wrapper')
const oauth = require('../services/oauth2')

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

module.exports = {
  redirectIfLogin,
  redirectIfNotLogin
}
