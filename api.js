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

const returnData = ({data}) => data;

const api = (accessToken) => (
  {
    boards: () => (
      axios.get(urlsWith(accessToken).boards())
        .then(returnData)
    ),
    pins: (id) => (
      axios.get(urlsWith(accessToken).pinsForBoard(id))
        .then(returnData)
    ),
    pin: (id) => (
      axios.get(urlsWith(accessToken).pin(id))
        .then(returnData)
    )
    
  }
);


module.exports = api;
