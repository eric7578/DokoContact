const express = require('express')

const router = express.Router()

router.get('/', function (req, res, next) {
  res.end(req.query.code)
})

module.exports = router
