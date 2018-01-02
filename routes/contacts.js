const express = require('express')
const _ = require('lodash')
const wrapper = require('./wrapper')
const contact = require('../services/contact')
const middlewares = require('./middlewares')

const router = express.Router()

router.use(middlewares.redirectIfNotLogin)

router.get('/', wrapper(async (req, res) => {
  if (req.query.q) {
    const contacts = await contact.searchPeople(req.session, req.query.q)
    res.json(contacts)
  } else {
    res.status(400).end('query term is required.')
  }
}))

module.exports = router
