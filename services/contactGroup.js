const axios = require('axios')

const getContactGroups = tokens =>
  axios({
    url: 'https://people.googleapis.com/v1/contactGroups',
    method: 'GET',
    headers: {
      Authorization: `${tokens.tokenType} ${tokens.accessToken}`
    }
  })
  .then(response => response.data.contactGroups)

module.exports = {
  getContactGroups
}
