const log = require('~/utils/log');
const jsonfile = require('jsonfile');

const CHOOSE_CMD = /^(?:\/choose(?:|@[^ ]*)|бот[, ]+(?:|подробно )(?:выбор|выбери|(кто|что)[ ]+лучше(?:\?|))(?: из|)(?::|)) (.+)/i;

GLOBAL_COMMANDS.push(CHOOSE_CMD);

const VARIANTS_SEPARATOR = /[ ]*(,| или | и )[ ]*/;

function ChooseBot(bot) {
  this.enabled = true;

  // === /choose command or text alias
  bot.onText(CHOOSE_CMD, (msg, match) => {
    if(!this.enabled) return;

    if(match.length < 2) return;

    const chatId = msg.chat.id;

    var matched = match[1];

    if(!matched || matched.length == 0) {
      return;
    }

    variants = matched.split(VARIANTS_SEPARATOR);

    if(variants.length > 1) {
      // a, b, c or d => ['a', ', ', 'b', ', ', 'c', ', ', ' or', 'd']
      // i don't know why these separators included, but we need to remove them
      for(var i = variants.length - 1; i >= 0; i--)
        if(i % 2 != 0) variants.splice(i, 1);
    } else {
      variants = matched.split(' ');
    }

    var selected = variants[Math.floor(Math.random() * variants.length)];

    var result;
    if(msg.text.indexOf('подробно') != -1) {
      result = 'Из вариантов [' + variants.join(', ') + '] был выбран: ' + selected;
    } else {
      result = selected;
    }

    bot.sendMessage(chatId, result);
  });
};

ChooseBot.prototype.start = function() {
  this.enabled = true;

  log(log.INF, 'ChooseBot started!');
}

ChooseBot.prototype.stop = function() {
  this.enabled = false;

  log(log.INF, 'ChooseBot stopped.');
}

module.exports = ChooseBot;