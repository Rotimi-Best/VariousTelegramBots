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

// === TO KEEP APP ALIVE

if(process.env.LOCAL == 0) {
  var http = require('http');
  setInterval(function() {
      http.get('http://mighty-fortress-44336.herokuapp.com');
  }, 300000); // every 5 minutes (300000)
}