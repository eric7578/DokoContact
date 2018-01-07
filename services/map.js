const axios = require('axios')
const _ = require('lodash')
const { stringify } = require('querystring')
const moment = require('moment')
const { Map } = require('../models')

const fromAddressToLatLng = address => {
  const query = stringify({
    key: process.env.GEOCODING_KEY,
    language: 'zh-TW',
    address
  })
  return axios
    .get(`https://maps.googleapis.com/maps/api/geocode/json?${query}`)
    .then(response => {
      const geocode = _.get(response, 'data.results[0]')
      if (geocode) {
        return Promise.resolve(geocode)
      } else {
        return Promise.reject(`Encode failed. ${address}`)
      }
    })
}

const makePin = contact => {
  return fromAddressToLatLng(contact['gd:postalAddress'])
    .then(geocode => {
      return {
        position: {
          lat: _.get(geocode, 'geometry.location.lat'),
          lng: _.get(geocode, 'geometry.location.lng')
        },
        name: contact.title,
        companyName: _.get(contact, ['gd:organization', 'gd:orgName']),
        jobTitle: _.get(contact, ['gd:organization', 'gd:orgTitle']),
        phoneNumbers: contact['gd:phoneNumber'],
        postalAddress: geocode.formatted_address
      }
    })
}

const makePins = async contacts => {
  return Promise.all(
    contacts
      .filter(contact => contact['gd:postalAddress'])
      .map(contact => makePin(contact))
  )
}

const makeMap = async (owner, title, pins) => {
  const map = new Map()
  map.owner = owner
  map.created = Date.now()
  map.title = title || generateMapTitle()
  map.pins = pins
  await map.save()
  return map.toJSON()
}

const generateMapTitle = () => {
  const time = moment().format('YYYY-MM-DD HH:mm')
  return `未命名[${time}]`
}

const findMapById = async mapId => {
  const map = await Map.findById(mapId)
  return map.toJSON()
}

const findMapsByOwner = async owner => {
  const maps = await Map.find({ owner })
    .select('_id title created')
    .sort({ created: -1 })
  return maps.map(map => {
    const mapData = map.toJSON()
    mapData.created = moment(mapData.created).format('YYYY-MM-DD HH:mm')
    return mapData
  })
}

module.exports = {
  findMapById,
  findMapsByOwner,
  makeMap,
  makePins
}
