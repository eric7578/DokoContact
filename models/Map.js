const mongoose = require('mongoose')

const pinSchema = mongoose.Schema({
  position: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  name: String,
  companyName: String,
  jobTitle: String,
  phoneNumbers: [String],
  postalAddress: String
})

const mapSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    required: true,
    default: Date.now
  },
  visited: Date,
  pins: [pinSchema]
})

module.exports = mongoose.model('Map', mapSchema)
