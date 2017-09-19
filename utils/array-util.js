function ArrayUtil() {

}

ArrayUtil.random = function(array) {
  if (!array || array.length == 0) return null;

  return array[Math.floor(Math.random() * array.length)];
}

module.exports = ArrayUtil;