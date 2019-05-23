require('dotenv').config();
const axios = require('axios');

// const extractImage = require('./lib/extract-image');
// const resolveUrl = require('./lib/resolve-url');

const URL = `https://api.pinterest.com/v1`;

const urlsWith = (accessToken) => (
  {
    boards: () => `${URL}/me/boards/?access_token=${accessToken}`,
    pinsForBoard: (id, cursor) => `${URL}/boards/${id}/pins/?access_token=${accessToken}&fields=id%2Clink%2Cnote%2Curl%2Cimage%2Coriginal_link&cursor=${cursor}`,
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
    // img: await extractImage(data.url, '.GrowthUnauthPinImage img'),
    // link: data.link ? await resolveUrl(data.link) : ''
  };
  return pin;
};

const convertPins = (pinArray) => {
  return Promise.all(pinArray.map(async p => await getRealPinInfo(p)))  ;
};

const traversePages = (token, id) => async ({data}) => {
  // collects the results from this page,
  // grabs data from the next page.
  let additionalData = [];
  if (data.page && data.page.cursor) {
    additionalData = await api(token).pins(id, data.page.cursor);
  }

  return [
    ...data.data,
    ...additionalData
  ];    
};


const api = (accessToken) => (
  {
    boards: () => (
      axios.get(urlsWith(accessToken).boards())
        .then(extractData)
        .catch(handleError)
    ),
    pins: (id, cursor='') => (
      axios.get(urlsWith(accessToken).pinsForBoard(id, cursor))
        // .then(extractData) // we don't want this, since we need
        // other keys
        .then(traversePages(accessToken, id))
        // .then(convertPins) // no longer needed, since not manually
        // resolving imgs and urls
        .catch(handleError)
    ),
    pin: (id) => (
      axios.get(urlsWith(accessToken).pin(id))
        .then(extractData)
        // .then(getRealPinInfo)
        .catch(handleError)
    )
    
  }
);


module.exports = api;
