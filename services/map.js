const axios = require('axios')
const _ = require('lodash')
const { stringify } = require('querystring')
const { Map } = require('../models')

const fromAddressToLatLng = address => {
  const query = stringify({
    key: process.env.GEOCODING_KEY,
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

module.exports = {
  makePins
}
