const express = require('express')
const wrapper = require('./wrapper')
const contactGroup = require('../services/contactGroup')
const middlewares = require('./middlewares')

const router = express.Router()

router.get('/', middlewares.redirectIfNotLogin, wrapper(async (req, res) => {
  const contactGroups = await contactGroup.getContactGroups(req.session)
  res.render('search', {
    title: 'DokoContact',
    contactGroups
  })
}))

module.exports = router
