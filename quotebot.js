module.exports = {
  start: start,
  stop: stop
};

var TelegramBot = require('node-telegram-bot-api');
var log = require('./utils/log');
var MsgStorage = require('./utils/msg-storage');

const VALID_MESSAGE = /^[^\/^@](.*)$/;
const QUOTES_CMD = /^(\/quotes[^ ]*$|список цитат$|бот (цитаты|список цитат))/;
const QUOTE_CMD = /^(\/quote[^ ]*$|цитата$|бот (жги|цитата|процитируй|(.*?)цитату|скажи|поумничай|(.*?)что думаешь))/;
const VERSION_CMD = /^\/version[^ ]*$/;
const COMMANDS = [QUOTES_CMD, QUOTE_CMD, VERSION_CMD];

const QUOTE_MAX_LENGTH = 50;
const MAX_QUOTES = 150;

var storages = { };

var bot = new TelegramBot(process.env.BOT_TOKEN, {
  polling: {
    autoStart: false,
    interval: process.env.POLLING_INTERVAL
  }
});

// === adding messages to the storage
bot.on('message', (msg) => {
  if(!msg.text || msg.forward_from) return;

  var text = msg.text;
  var chatId = msg.chat.id;

  if(text.length == 0 || text.length >= QUOTE_MAX_LENGTH) return;

  if(!isMessageValid(text)) {
    log(log.INF, 'Message ignored: '  + text + ' (' + msg.chat.title + ')')
    return;
  }

  if(!storages[chatId]) {
    storages[chatId] = new MsgStorage(MAX_QUOTES);
  }

  var result = storages[chatId].add(msg);

  log(log.INF, 'Message ' + (result? 'added' : 'not added') + ': ' + text + ' (' + msg.chat.title + ')');
});

// === /quote command or text aliases
bot.onText(QUOTE_CMD, (msg) => {
  var chatId = msg.chat.id;

  if(!storages[chatId] || storages[chatId].getSize() == 0) {
    bot.sendMessage(chatId, 'Нечего цитировать.');
    return;
  }

  var randomMsg = storages[chatId].random();

  bot.forwardMessage(chatId, randomMsg.chat.id, randomMsg.message_id, { disable_notification: true });
});

// === /quotes command
bot.onText(QUOTES_CMD, (msg) => {
  var chatId = msg.chat.id;

  if(!storages[chatId] || storages[chatId].getSize() == 0) {
    bot.sendMessage(chatId, 'Список цитат пуст.');
    return;
  }

  var result = 'Доступные цитаты:\n';
  result += storages[chatId].get().map((msg) => msg.from.first_name + ': '+ msg.text).join('\n');

  bot.sendMessage(chatId, result);
});

// === /version command
bot.onText(VERSION_CMD, (msg) => {
  var chatId = msg.chat.id;

  bot.sendMessage(chatId, require('./package').version);
});

// checks if message is not a command
function isMessageValid(msg) {
  if(!VALID_MESSAGE.test(msg)) {
    return false;
  }

  return COMMANDS.map((cmd) => cmd.test(msg)).indexOf(true) == -1;
}

function start() {
  bot.startPolling();

  log(log.INF, 'QuoteBot started!');
}

function stop() {
  bot.stopPolling();

  log(log.INF, 'QuoteBot stopped.');
}