require('dotenv').config();
const axios = require('axios');

const URL = `https://api.pinterest.com/v1`;

const urlsWith = (accessToken) => (
  {
    boards: () => `${URL}/me/boards/?access_token=${accessToken}`,
    pinsForBoard: (id) => `${URL}/boards/${id}/pins/?access_token=${accessToken}`,
    pin: (id) => `${URL}/pins/${id}/?access_token=${accessToken}`,    
  }
);

// Wow. This is ridiculous.
const extractData = ({data}) => data.data;
const handleError = (err) => {
  console.log(err);
};

const api = (accessToken) => (
  {
    boards: () => (
      axios.get(urlsWith(accessToken).boards())
        .then(extractData)
        .catch(handleError)
    ),
    pins: (id) => (
      axios.get(urlsWith(accessToken).pinsForBoard(id))
        .then(extractData)
        .catch(handleError)
    ),
    pin: (id) => (
      axios.get(urlsWith(accessToken).pin(id))
        .then(extractData)
        .catch(handleError)
    )
    
  }
);


module.exports = api;
