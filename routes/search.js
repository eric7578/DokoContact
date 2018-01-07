const express = require('express')
const _ = require('lodash')
const wrapper = require('./wrapper')
const contact = require('../services/contact')
const map = require('../services/map')

const router = express.Router()

router.get('/', wrapper(async (req, res) => {
  const contactGroups = await contact.getContactGroups(req.user.token)
  res.render('search', {
    title: 'DokoContact',
    contactGroups
  })
}))

module.exports = router
