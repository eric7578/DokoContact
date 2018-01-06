const express = require('express')
const _ = require('lodash')
const wrapper = require('./wrapper')
const contact = require('../services/contact')
const map = require('../services/map')
const middlewares = require('./middlewares')

const router = express.Router()

router.use(middlewares.redirectIfNotLogin)

router.get('/:mapId', wrapper(async (req, res) => {

}))

module.exports = router
