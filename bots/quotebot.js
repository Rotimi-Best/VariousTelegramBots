const Storage = require('../utils/storage');
const DropboxHelper = require('../utils/dropbox-helper');
const log = require('../utils/log');

const QUOTES_CMD = /^(\/quotes(|@[^ ]*)$|бот[, ]+(цитаты|сколько цитат|(что|сколько)(| цитат) запомнил?))/i;
const QUOTE_CMD = /^(\/quote(|@[^ ]*)$|цитата$|бот[, ]+(жги|цитата|процитируй|(.*?)цитату|скажи|поумничай|(.*?)что думаешь|ответь|дай[ ]+совет|посоветуй|прокомментируй|выскажись))/i;
const CLEAR_QUOTES_CMD = /^\/clearquotes(?:|@[^ ]*)[ ]*(.*)$/i;

GLOBAL_COMMANDS.push(QUOTES_CMD, QUOTE_CMD, CLEAR_QUOTES_CMD);

const ENCODING_VERSION = 2;

const MAX_QUOTE_ATTEMPTS = 10;
const QUOTE_MAX_LENGTH = 50;
const MAX_QUOTES = 500;

function QuoteBot(bot, databasePath, saveInterval) {
  this.bot = bot;

  this.enabled = true;
  this.storages = { };

  this.saveInterval = saveInterval || 60000; // 1 minute
  this.databasePath = databasePath || 'quotebot.db.json';

  // === adding messages to the storage
  this.bot.on('message', (msg) => {
    if(!this.enabled) return;

    // >= 0 because group chat ids are negative
    if(!msg.text || msg.forward_from || !msg.chat.id || msg.chat.id >= 0) return;

    const text = msg.text;
    const chatId = msg.chat.id;

    if(text.length == 0 || text.length >= QUOTE_MAX_LENGTH) return;

    if(isACommandOrMention(text)) {
      return;
    }

    if(!this.storages[chatId]) {
      this.storages[chatId] = new Storage(MAX_QUOTES);
    }

    var result = this.storages[chatId].add({ message_id: msg.message_id });

    log(log.INF, 'Message ' + (result? 'added' : 'not added') + ': ' + text + ' (' + msg.chat.title + ')');
  });

  // === /quote command or text alias
  bot.onText(QUOTE_CMD, (msg) => {
    if(!this.enabled) return;

    this.quote(msg.chat.id);
  });

  // === /quotes command or text alias
  bot.onText(QUOTES_CMD, (msg) => {
    if(!this.enabled) return;

    const chatId = msg.chat.id;

    if(!this.storages[chatId] || this.storages[chatId].getSize() == 0) {
      bot.sendMessage(chatId, 'Список цитат пуст.');
      return;
    }

    var result = 'Доступно цитат в этом чате: ' + this.storages[chatId].getSize();

    this.bot.sendMessage(chatId, result);
  });

  // === /clearquotes command or text alias
  this.bot.onText(CLEAR_QUOTES_CMD, (msg, match) => {
    if(!this.enabled) return;

    const chatId = msg.chat.id;

    bot.getChatMember(chatId, msg.from.id)
      .then(member => {
        // /clearquotes all
        if(match[1] == 'all') {
          if(isAppAdmin(member)) {
            this.storages = { };
            this.save();

            this.bot.sendMessage(chatId, 'База данных QuoteBot была очищена.');
          } else {
            this.bot.sendMessage(chatId, 'Только администратор приложения может это делать.');
          }
        }
        else if(isAdmin(member)) {
          if(this.storages[chatId]) {
            this.storages[chatId].clear();
            this.save();
          }

          this.bot.sendMessage(chatId, 'Список цитат был очищен.');
        } else {
          this.bot.sendMessage(chatId, 'Только администраторы могут это делать.');
        }
      });
  });

  // ================ DATABASE
  this.dropbox = new DropboxHelper();

  this.load(databasePath, () => {
    setInterval((self => () => self.save())(this), this.saveInterval);
  });
}

QuoteBot.prototype.quote = function(chatId, attempts) {
  attempts = attempts || 1;

  if(!this.storages[chatId] || this.storages[chatId].getSize() == 0) {
    this.bot.sendMessage(chatId, 'Нечего цитировать.');
    return;
  }

  var randomMsg = this.storages[chatId].random();

  this.bot.forwardMessage(chatId, chatId, randomMsg.message_id, { disable_notification: true })
    .catch(error => {
      if (error.response.statusCode == 400) {
        if (attempts >= MAX_QUOTE_ATTEMPTS) {
          log(log.ERR, "Couldn't quote deleted message and couldn't find another one :(");

          this.bot.sendMessage(chatId, 'Не удалось ничего процитировать.');
          return;
        }

        log(log.ERR, "Couldn't quote deleted message, trying another one.. (" + attempts + ")");

        this.quote(chatId, attempts + 1);
      } else {
        log(log.ERR, 'Catched error: ' + JSON.stringify(error.response));
      }
    });
};

QuoteBot.prototype.load = function(databasePath, onResponse) {
  databasePath = databasePath || this.databasePath;

  this.dropbox.load(databasePath, (contents) => {
    var encoded = JSON.parse(contents);

    for (var i = 0; i < encoded.length; i++) {
      var storage = encoded[i];

      this.storages[storage.id] = new Storage(storage.size, storage.values);
    }

    log(log.INF, 'Quotes have been loaded!');
    if(onResponse) onResponse(contents, null);
  }, (err) => {
    log(log.ERR, 'Error while loading quotes: ' + err.text.error_summary);
    if(onResponse) onResponse(null, err);
  });
};

QuoteBot.prototype.save = function(databasePath) {
  databasePath = databasePath || this.databasePath;

  var encoded = [];

  var storageKeys = Object.keys(this.storages);

  for (var i = 0; i < storageKeys.length; i++) {
    var id = storageKeys[i];
    var storage = this.storages[id];

    if(!storage || storage.getSize() == 0 || !storage.toArray()) {
      continue;
    }

    encoded.push({ id: id, size: storage.getMaxSize(), values: storage.toArray(), v: ENCODING_VERSION });
  }

  this.dropbox.save(databasePath, JSON.stringify(encoded), () => {
    log(log.INF, 'Quotes have been saved!');
  }, (err) => {
    log(log.ERR, 'Error while saving quotes: ' + err.text.error_summary)
  });
};

QuoteBot.prototype.start = function() {
  this.enabled = true;

  log(log.INF, 'QuoteBot started!');
};

QuoteBot.prototype.stop = function() {
  this.enabled = false;

  log(log.INF, 'QuoteBot stopped.');
};

module.exports = QuoteBot;