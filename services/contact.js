const axios = require('axios')
const xml2js = require('xml2js')
const querystring = require('querystring')
const _ = require('lodash')

const parseXML = response => new Promise((resolve, reject) => {
  const xmlParserOptions = {
    trim: true,
    ignoreAttrs: true,
    mergeAttrs: true,
    async: true,
    explicitArray: false
  }
  xml2js.parseString(response.data, xmlParserOptions, (err, result) => {
    if (err) reject(err)
    else resolve(result)
  })
})

const retrieveEntry = data => _.get(data, 'feed.entry', [])

const getContactGroups = token => {
  return axios
    .get('https://www.google.com/m8/feeds/groups/default/full', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(parseXML)
    .then(retrieveEntry)
}

const getPeople = (token, contactId) => {
  return axios
    .get(contactId, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(parseXML)
    .then(data => data.entry)
}

const getPeopleUnderContactGroup = (token, groupId) => {
  return axios
    .get(`https://www.google.com/m8/feeds/contacts/default/full?group=${groupId}&max-results=10000`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(parseXML)
    .then(retrieveEntry)
}

const searchPeople = (token, term) => {
  const query = querystring.stringify({
    v: '3.0',
    q: term
  })
  return axios
    .get(`https://www.google.com/m8/feeds/contacts/default/full?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(parseXML)
    .then(retrieveEntry)
}

module.exports = {
  getContactGroups,
  getPeople,
  getPeopleUnderContactGroup,
  searchPeople
}
