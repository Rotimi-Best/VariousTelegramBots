const log = require('../utils/log');

const VERSION_CMD = /^\/version(|@[^ ]*)$/i;

GLOBAL_COMMANDS.push(VERSION_CMD);

function KernelBot(bot) {
  this.enabled = true;

  // === /version command
  bot.onText(VERSION_CMD, (msg) => {
    if(!this.enabled) return;

    const chatId = msg.chat.id;

    bot.sendMessage(chatId, require('~/package.json').version);
  });
}

KernelBot.prototype.start = function() {
  this.enabled = true;

  log(log.INF, 'KernelBot started!');
}

KernelBot.prototype.stop = function() {
  this.enabled = false;

  log(log.INF, 'KernelBot stopped.');
}

module.exports = KernelBot;