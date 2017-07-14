global.GLOBAL_COMMANDS = [];

global.isACommandOrMention = function(msg) {
  // starts with / or @
  if(/^(\/|@)(.*)/.test(msg)) {
    return true;
  }

  // equals at least one available command
  for (var i = GLOBAL_COMMANDS.length - 1; i >= 0; i--) {
    if(GLOBAL_COMMANDS[i].test(msg)) return true;
  }

  return false;
}

global.isAppAdmin = function(obj) {
  if(!obj) return false;

  var appAdmin = process.env.ADMIN_USERNAME;

  return obj == appAdmin
          || obj.toUpperCase && (obj.toUpperCase() == appAdmin.toUpperCase())
          || isAppAdmin(obj.username)
          || isAppAdmin(obj.user);
}

global.isAdmin = function(obj) {
  if(!obj) return false;

  return ['administrator', 'creator'].indexOf(obj.status) != -1
          || isAppAdmin(obj);
}

const TelegramBot = require('node-telegram-bot-api');
const DropboxHelper = require('./utils/dropbox-helper');
const HerokuApp = require('./heroku-app');
const KernelBot = require('./bots/kernelbot');
const QuoteBot = require('./bots/quotebot');
const ChooseBot = require('./bots/choosebot');
const log = require('./utils/log');

log(log.INF, '---------------------------------');
log(log.INF, 'WELCOME TO VARIOUS TELEGRAM BOTS!');
log(log.INF, '---------------------------------');

new HerokuApp();

const bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    autoStart: true,
    interval: process.env.POLLING_INTERVAL
  }
});

DropboxHelper.accessToken = process.env.DROPBOX_TOKEN;

var bots = [];
bots.push(new KernelBot(bot));
bots.push(new QuoteBot(bot, 'quotebot/storages.json', process.env.DATABASE_SAVE_INTERVAL));
bots.push(new ChooseBot(bot));

bots.forEach(bot => bot.start());

// === DEBUG
if(process.env.DEBUG == 1) {
  process.on('uncaughtException', function (e) {
    log(log.ERR, 'Exception: ' + e);
  });
}

