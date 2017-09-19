const log = require('../utils/log');

const REACT_CMD = /^(\/(react|reaction)(|@[^ ]*)$|бот[, ]+(отреагируй|(твоя |)реакция|(отправь |)смайл|что[ ]+|скажешь|тво(ё|е)[ ]+мнение))/i;

GLOBAL_COMMANDS.push(REACT_CMD);

const REACTIONS = [
  '🤔', '😳', '😐', '🙊', '😡', '😏', '😕', '🙄',
  '🤢', '👌🏻👈🏻', '🍆', '🌚', '🌝', '😟', '🗑', '😅',
  '😰', '🙃', '🌕🌖🌗🌘🌚', '🤤', '¯\\_(ツ)_/¯', 'ми ло та',
  'лови плюсик', 'хмык', 'копец'
];

const REACT_MSG_INTERVAL = [15, 75];

function ReactionBot(bot) {
  this.bot = bot;
  this.enabled = true;

  this.counts = { };
  this.intervals = { };

  // === react on message
  this.bot.on('message', (msg) => {
    if(!this.enabled) return;

    // >= 0 because group chat ids are negative
    if(!msg.text || msg.forward_from || msg.reply_to_message
        || !msg.chat.id || msg.chat.id >= 0) return;

    const text = msg.text;
    const chatId = msg.chat.id;

    if(isACommandOrMention(text)) {
      return;
    }

    if (!this.counts[chatId]) {
      this.counts[chatId] = 0;
    }

    if(!this.intervals[chatId]) {
      this.intervals[chatId] = this.generateInterval();
    }

    this.counts[chatId]++;

    if (this.counts[chatId] >= this.intervals[chatId]) {
      this.react(chatId, msg.message_id);

      this.intervals[chatId] = this.generateInterval();
      this.counts[chatId] = 0;
    }
  });

  // === /react command or text alias
  this.bot.onText(REACT_CMD, (msg) => {
    if(!this.enabled) return;

    const chatId = msg.chat.id;

    if (msg.reply_to_message) {
      this.react(msg.chat.id, msg.reply_to_message.message_id);
    } else {
      this.react(msg.chat.id);
    }
  });
}

ReactionBot.prototype.react = function(chatId, msgId) {
  var options = { disable_notification: true };

  if (msgId) options.reply_to_message_id = msgId;

  var reaction = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];

  this.bot.sendMessage(chatId, reaction, options);
};

ReactionBot.prototype.generateInterval = function() {
  var min = REACT_MSG_INTERVAL[0];
  var max = REACT_MSG_INTERVAL[1];

  return Math.floor(min + Math.random() * (max - min));
};

ReactionBot.prototype.start = function() {
  this.enabled = true;

  log(log.INF, 'ReactionBot started!');
};

ReactionBot.prototype.stop = function() {
  this.enabled = false;

  log(log.INF, 'ReactionBot stopped.');
};

module.exports = ReactionBot;