var MsgStorage = function(size) {
  var maxMsgCount = 100;
  var messages = [];

  this.add = (msg) => {
    messages.push(msg);

    if (messages.length > maxMsgCount) {
      messages.shift(); // removes first message from the array
    }

    return true;
  };

  this.remove = (msg) => {
    var index = messages.indexOf(msg);

    if (index > -1) {
        array.splice(index, 1);
        return true;
    }

    return false;
  };

  this.get = () => messages;

  this.random = () => messages[Math.floor(Math.random() * messages.length)];

  this.clear = () => {
    messages = [];
  };

  this.setMaxMsgCount = (value) => {
    maxMsgCount = value;
  };

  this.getSize = () => {
    return messages.length;
  };

  id = Math.random() * 1000000;
  this.getId = () => id;
};

module.exports = MsgStorage;