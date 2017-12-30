const express = require('express')
const wrapper = require('./wrapper')
const people = require('../services/people')
const middlewares = require('./middlewares')

const router = express.Router()

router.use(middlewares.redirectIfNotLogin)

router.get('/', wrapper(async (req, res) => {
  const contacts = await people.searchPeople(req.session, req.query.q)
  res.json(contacts)
}))

module.exports = router
