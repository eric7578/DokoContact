const express = require('express')
const _ = require('lodash')
const wrapper = require('./wrapper')
const contact = require('../services/contact')
const map = require('../services/map')

const router = express.Router()

router.post('/preview', wrapper(async (req, res) => {
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

  const pins = await map.makePins(contactInGroups)

  res.render('map-view', { pins })
}))

module.exports = router
