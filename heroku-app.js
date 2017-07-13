const express = require('express');
const http = require('http');
const log = require('./utils/log');

function HerokuApp() {
  this.app = express();

  this.app.set('port', (process.env.PORT || 5000));

  this.app.get('/', (request, response) => {
    response.send('Not much to look at');
  });

  this.app.listen(this.app.get('port'), () => {
    log(log.INF, 'VariousTelegramBots is running on port ' + this.app.get('port'));
  });

  if(process.env.LOCAL == 0) {
    // SMALL TRICK TO KEEP HEROKU APP ALIVE
    setInterval(function() {
        http.get(process.env.HEROKU_APP_ADDRESS);
    }, process.env.HEROKU_KEEP_ALIVE_INTERVAL);
  }
}

module.exports = HerokuApp;