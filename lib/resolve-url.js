const {http, https} = require('follow-redirects');

const resolveUrl = (url) => {
  let req = url.startsWith('https') ? https : http;
  return new Promise( (resolve, reject) => {
    req.get(url, (response) => {
      resolve(response.responseUrl);
    });    
  });
};

module.exports = resolveUrl;
