var log = require('./utils/log');
var pjson = require('./package.json');

log(log.INF, '---------------------------------');
log(log.INF, 'WELCOME TO VARIOUS TELEGRAM BOTS!');
log(log.INF, '---------------------------------');

require('./quotebot').start();

// === DEBUG
//
if(process.env.DEBUG == 1) {
  process.on('uncaughtException', function (e) {
    log(log.ERR, 'Exception: ' + e);
  });
}

// Heroku specific

var app = require('express')();

app.set('port', (process.env.PORT || 5000));

app.get('/', function(request, response) {
  response.send('Not much to look at');
});

app.listen(app.get('port'), function() {
  console.log('Telegram bot is running on port', app.get('port'));
});

if(process.env.LOCAL == 0) {
  // SMALL TRICK TO KEEP HEROKU APP ALIVE
  var http = require('http');
  setInterval(function() {
      http.get('http://mighty-fortress-44336.herokuapp.com');
  }, 300000); // every 5 minutes (300000)
}