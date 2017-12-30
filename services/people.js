const axios = require('axios')
const querystring = require('querystring')
const _ = require('lodash')

// get single person info via people api
const getPeople = (tokens, resource) => {
  const personFields = ['names', 'addresses', 'phoneNumbers', 'organizations']
  return axios({
      url: `https://people.googleapis.com/v1/${resource}?personFields=${personFields.join(',')}`,
      headers: {
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`
      }
    })
    .then(response => {
      const name = response.data.names[0].displayName
      const addresses = response.data.addresses.map(o => o.formattedValue)
      const phoneNumbers = response.data.phoneNumbers(o => o.value)
      const organizations = response.data.organizations.map(o => {
        return {
          organization: o.department,
          title: o.title
        }
      })

      return {
        name,
        addresses,
        phoneNumbers,
        organizations
      }
    })
}

// search peoples via contact api
const searchPeople = (tokens, term) => {
  const query = querystring.stringify({
    alt: 'json',
    v: '3.0',
    q: term
  })
  return axios({
      url: `https://www.google.com/m8/feeds/contacts/default/full?${query}`,
      headers: {
        'GData-Version': '3.0',
        Authorization: `${tokens.tokenType} ${tokens.accessToken}`
      }
    })
    .then(response => {
      if (_.has(response.data, 'feed.entry')) {
        const { entry } = response.data.feed
        return entry.map(data => {
          const name = _.get(data, 'gd$name.gd$fullName.$t', '')
          const addresses = _.get(data, 'gd$structuredPostalAddress', [])
            .map(o => _.get(o, 'gd$formattedAddress.$t'))
          const phoneNumbers = _.get(data, 'gd$phoneNumber', []).map(o => o.$t)
          const organizations = _.get(data, 'gd$organization', []).map(o => {
            return {
              organization: _.get(o, 'gd$orgName.$t'),
              title: _.get(o, 'gd$orgTitle.$t')
            }
          })

          return {
            name,
            addresses,
            phoneNumbers,
            organizations
          }
        })
      } else {
        return []
      }
    })
}

module.exports = {
  getPeople,
  searchPeople
}
