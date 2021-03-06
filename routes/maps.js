const express = require('express')
const _ = require('lodash')
const { ensureLoggedIn } = require('connect-ensure-login')
const wrapper = require('./wrapper')
const contact = require('../services/contact')
const map = require('../services/map')

const router = express.Router()

router.post('/preview', ensureLoggedIn('/'), wrapper(async (req, res) => {
  const contactIds = _.get(req, 'body.contacts', [])
  const groupIds = _.get(req, 'body.groups', [])

  let contacts = await Promise.all(
    contactIds.map(contactId =>
      contact.getPeople(req.user.token, contactId)
    )
  )

  let contactInGroups = await Promise.all(
    groupIds.map(groupId =>
      contact.getPeopleUnderContactGroup(req.user.token, groupId)
    )
  )
  contactInGroups = _.flatten(contactInGroups)

  const pins = await map.makePins(contacts.concat(contactInGroups))

  res.render('map-view', {
    preview: true,
    pins
  })
}))

router.post('/', ensureLoggedIn('/'), wrapper(async (req, res) => {
  const generatedMap = await map.makeMap(req.user.id, req.body.title, req.body.pins)
  res.json(generatedMap.exposedId)
}))

router.get('/:mapId', wrapper(async (req, res) => {
  const foundMap = await map.findMapById(req.params.mapId)

  res.render('map-view', {
    title: foundMap.title,
    pins: foundMap.pins
  })
}))

module.exports = router