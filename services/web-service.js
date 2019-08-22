const http = require('http');
const express = require('express');
const webServerConfig = require('../config/web-service.js');
const morgan = require('morgan');

// line that requires ../config/web-server.js here
const database = require('./database.js');

let httpServer;

function initialize() {
  return new Promise((resolve, reject) => {
    const app = express();
    app.use(morgan('combined'));
    httpServer = http.createServer(app);

    app.get('/', (req, res) => {
     // const result = await database.simpleExecute('select user, systimestamp from dual');
      //const user = result.rows[0].USER;
      //const date = result.rows[0].SYSTIMESTAMP;
     // res.end(`DB user: ${user}\nDate: ${date}`);
      res.end('Hello World!');
    });

    httpServer.listen(webServerConfig.port)
      .on('listening', () => {
        console.log(`Web server listening on localhost:${webServerConfig.port}`);

        resolve();
      })
      .on('error', err => {
        reject(err);
      });
  });
}

module.exports.initialize = initialize;

// *** previous code above this line ***
 
function close() {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }
 
      resolve();
    });
  });
}
 
module.exports.close = close;