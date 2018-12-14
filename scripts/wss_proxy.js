#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const httpProxy = require('http-proxy');

httpProxy.createServer({
  target: 'ws://localhost:4003',
  ssl: {
    key: fs.readFileSync(path.resolve(__dirname, '..', 'ssl', 'localhost+2-key.pem'), 'utf8'),
    cert: fs.readFileSync(path.resolve(__dirname, '..', 'ssl', 'localhost+2.pem'), 'utf8')
  },
  ws: true
}).listen(4004);
