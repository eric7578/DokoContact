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

router.post('/', wrapper(async (req, res) => {
  const contactIds = _.get(req, 'body.contacts', [])
  const groupIds = _.get(req, 'body.groups', [])

  let contacts = await Promise.all(
    contactIds.map(contactId =>
      contact.getPeople(req.session, contactId)
    )
  )

  let contactInGroups = await Promise.all(
    groupIds.map(groupId =>
      contact.getPeopleUnderContactGroup(req.session, groupId)
    )
  )
  contactInGroups = _.flatten(contactInGroups)

  res.json({ contacts, contactInGroups })
}))

module.exports = router
