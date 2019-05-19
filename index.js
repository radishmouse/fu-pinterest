require('dotenv').config();

const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

https.globalAgent.options.rejectUnauthorized = false;
const setupAuth = require('./auth');

const api = require('./api');

const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/client-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/client-cert.pem'))
};

const app = express();

app.use(session({
    store: new FileStore(),  // no options for now
    secret: process.env.SESSION_SECRET
}));

setupAuth(app);


app.get('/', async (req, res) => {
  if (req.isAuthenticated()) {
    const {accessToken} = req.session.passport.user;
    const boards = await api(accessToken).boards();
    res.json(boards);
  } else {    
    res.send(`
<a href="/login">login</a>
  `);
  }
});



http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`Listening on ${HTTP_PORT}`);
});
https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`Listening securely on ${HTTPS_PORT}`);
  
});
