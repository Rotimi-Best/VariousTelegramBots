const log = require('../utils/log');

const CHOOSE_CMD = /^(?:\/choose(?:|@[^ ]*)|бот[, ]+(?:|подробно )(?:выбор|выбери|(?:кто|что)[ ]+лучше(?:\?|))(?: из|)(?::|)) (.+)/i;
const YES_OR_NO_CMD = /^(?:\/yes_or_no(?:|@[^ ]*)|бот[, ]+(?:да(?:,|)(?:[ ]+или[ ]+|\/|;|[ ]+)нет|правда[ ]+ли[ ]+это|это[ ]+правда))/i;

const YES_OR_NO_ANSWERS = ['да', 'нет'];

GLOBAL_COMMANDS.push(CHOOSE_CMD);

const VARIANTS_SEPARATOR = /[ ]*(,| или | и | либо |;)[ ]*/;

function ChooseBot(bot) {
  this.enabled = true;

  // === /choose command or text alias
  bot.onText(CHOOSE_CMD, (msg, match) => {
    if(!this.enabled) return;

    if(match.length < 2) return;

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

    bot.sendMessage(msg.chat.id, result);
  });

  // === /choose command or text alias
  bot.onText(YES_OR_NO_CMD, (msg, match) => {
    if(!this.enabled) return;

    bot.sendMessage(msg.chat.id, this.yesOrNo());
  });
};

ChooseBot.prototype.yesOrNo = function() {
  return YES_OR_NO_ANSWERS[Math.floor(Math.random() * 2)];
}

ChooseBot.prototype.start = function() {
  this.enabled = true;

  log(log.INF, 'ChooseBot started!');
}

ChooseBot.prototype.stop = function() {
  this.enabled = false;

  log(log.INF, 'ChooseBot stopped.');
}

module.exports = ChooseBot;