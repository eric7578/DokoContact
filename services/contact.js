const axios = require('axios')
const xml2js = require('xml2js')
const querystring = require('querystring')
const pathToRegexp = require('path-to-regexp')
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

const transformContactGroupId = entries => {
  const re = pathToRegexp('http://www.google.com/m8/feeds/groups/:userMail/base/:groupId')
  return entries.map(entry => {
    const params = re.exec(entry.id)
    entry.id = params[2]
    return entry
  })
}

const transformContactId = entries => {
  const re = pathToRegexp('http://www.google.com/m8/feeds/contacts/:userMail/base/:contactId')
  return entries.map(entry => {
    const params = re.exec(entry.id)
    entry.id = params[2]
    return entry
  })
}

const getContactGroups = tokens => {
  return axios
    .get('https://www.google.com/m8/feeds/groups/default/full', {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`
      }
    })
    .then(parseXML)
    .then(retrieveEntry)
    .then(transformContactGroupId)
}

const getPeople = (tokens, resource) => {
  const personFields = ['names', 'addresses', 'phoneNumbers', 'organizations']
  return axios
    .get(`https://people.googleapis.com/v1/${resource}?personFields=${personFields.join(',')}`, {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`
      }
    })
    .then(parseXML)
    .then(retrieveEntry)
}

const searchPeople = (tokens, term) => {
  const query = querystring.stringify({
    v: '3.0',
    q: term
  })
  return axios
    .get(`https://www.google.com/m8/feeds/contacts/default/full?${query}`, {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`
      }
    })
    .then(parseXML)
    .then(retrieveEntry)
    .then(transformContactId)
}

module.exports = {
  getContactGroups,
  getPeople,
  searchPeople
}
