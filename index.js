require('dotenv').config();

const fs = require('fs');
const path = require('path');

const express = require('express');
const https = require('https');
const http = require('http');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3443;

const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/client-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/client-cert.pem'))
};
https.globalAgent.options.rejectUnauthorized = false;

const app = express();
const setupAuth = require('./auth');
const logger = require('./lib/logger');
const compress = require('compression');
const pinterestRouter = require('./routes/pinterest');

app.use(session({
    store: new FileStore(),  // no options for now
    secret: process.env.SESSION_SECRET
}));

setupAuth(app);

app.use(logger);
app.use(compress());
app.use(pinterestRouter);

http.createServer(app).listen(HTTP_PORT, () => {
  console.log(`Listening on ${HTTP_PORT}`);
});
https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`Listening securely on ${HTTPS_PORT}`);
  
});
