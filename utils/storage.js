const ArrayUtil = require('./array-util');

function Storage(size, values) {
  this._maxSize = size || 100;
  this._storage = values || [];
}

Storage.prototype.add = function(obj) {
  this._storage.push(obj);

  if (this.getSize() > this.getMaxSize()) {
    this._storage.shift(); // removes first object from the array
  }

  return true;
}

Storage.prototype.remove = function(obj) {
  var index = this._storage.indexOf(obj);

  if (index > -1) {
      this._storage.splice(index, 1);
      return true;
  }

  return false;
}

Storage.prototype.toArray = function() {
  return this._storage;
}

Storage.prototype.random = function() {
  return ArrayUtil.random(this._storage);
}

Storage.prototype.clear = function() {
  this._storage = [];
}

Storage.prototype.getMaxSize = function() {
  return this._maxSize;
}

Storage.prototype.setMaxSize = function(value) {
  this._maxSize = value;
}

Storage.prototype.getSize = function() {
  return this._storage.length;
}

module.exports = Storage;