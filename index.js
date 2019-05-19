const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/client-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/client-cert.pem'))
};

const app = express();


app.get('/', (req, res) => {
  res.send('so say we all');
});



http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`Listening on ${HTTP_PORT}`);
});
https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`Listening securely on ${HTTPS_PORT}`);
  
});
