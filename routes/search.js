const express = require('express')
const _ = require('lodash')
const wrapper = require('./wrapper')
const contact = require('../services/contact')
const middlewares = require('./middlewares')

const router = express.Router()

router.use(middlewares.redirectIfNotLogin)

router.get('/', wrapper(async (req, res) => {
  const contactGroups = await contact.getContactGroups(req.session)
  res.render('search', {
    title: 'DokoContact',
    contactGroups
  })
}))

module.exports = router
