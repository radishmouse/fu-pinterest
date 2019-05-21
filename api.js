require('dotenv').config();
const axios = require('axios');

const extractImage = require('./lib/extract-image');
const resolveUrl = require('./lib/resolve-url');

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
  console.log('...from HandleError');
};

const getRealPinInfo = async (data) => {
  const pin = {
    ...data,
    img: await extractImage(data.url, '.GrowthUnauthPinImage img'),
    link: data.link ? await resolveUrl(data.link) : ''
  };
  return pin;
};

const convertPins = (pinArray) => {
  return pinArray.map(async p => await getRealPinInfo(p))  ;
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
        .then(convertPins)
        .catch(handleError)
    ),
    pin: (id) => (
      axios.get(urlsWith(accessToken).pin(id))
        .then(extractData)
        .then(getRealPinInfo)
        .catch(handleError)
    )
    
  }
);


module.exports = api;
