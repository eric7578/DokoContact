const express = require('express')
const _ = require('lodash')
const wrapper = require('./wrapper')
const contact = require('../services/contact')

const router = express.Router()

router.get('/', wrapper(async (req, res) => {
  if (req.query.q) {
    const contacts = await contact.searchPeople(req.user.token, req.query.q)
    res.json(contacts)
  } else {
    res.status(400).end('query term is required.')
  }
}))

module.exports = router
