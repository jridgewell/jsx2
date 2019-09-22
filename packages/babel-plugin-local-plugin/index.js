module.exports = function(babel, options) {
  return require(options.plugin)(babel, options.options);
}
