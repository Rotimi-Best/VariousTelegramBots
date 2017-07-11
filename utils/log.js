var log = function(level, message) {
  if(!log.enabled) return;

  console.log('# ' + getDate() + ' # ' + level + ' # ' + message);
};

log.INF = 'INF';
log.ERR = 'ERR';
log.WARN = 'WARN';

log.enabled = true;

module.exports = log;

function getDate() {
    var date = new Date();

    return date.getDate() + '.'
            + (date.getMonth() + 1) + ' '
            + date.getHours() + ':'
            + date.getMinutes() + '.'
            + date.getSeconds();
}