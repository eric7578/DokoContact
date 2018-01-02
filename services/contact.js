const axios = require('axios')
const xml2js = require('xml2js')
const querystring = require('querystring')

const parseXML = data => new Promise((resolve, reject) => {
  const xmlParserOptions = {
    trim: true,
    ignoreAttrs: true,
    mergeAttrs: true,
    async: true,
    explicitArray: false
  }
  xml2js.parseString(data, xmlParserOptions, (err, result) => {
    if (err) reject(err)
    else resolve(result)
  })
})

const getContactGroups = tokens => {
  return axios
    .get('https://www.google.com/m8/feeds/groups/default/full', {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`
      }
    })
    .then(response => parseXML(response.data))
}

const getPeople = (tokens, resource) => {
  const personFields = ['names', 'addresses', 'phoneNumbers', 'organizations']
  return axios
    .get(`https://people.googleapis.com/v1/${resource}?personFields=${personFields.join(',')}`, {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`
      }
    })
    .then(response => parseXML(response.data))
}

const searchPeople = (tokens, term) => {
  const query = querystring.stringify({
    q: term
  })
  return axios
    .get(`https://www.google.com/m8/feeds/contacts/default/full?${query}`, {
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`
      }
    })
    .then(response => parseXML(response.data))
}

module.exports = {
  getContactGroups,
  getPeople,
  searchPeople
}
