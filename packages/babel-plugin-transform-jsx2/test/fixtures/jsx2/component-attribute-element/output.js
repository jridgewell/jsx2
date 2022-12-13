var _templateBlock = require("jsx2").templateBlock;
var _createElement = require("jsx2").createElement;
function test() {
  return _createElement(Component, {
    attr: _templateBlock(_template(), [])
  });
}
function _template() {
  const tree = _createElement("inner", null);
  _template = () => tree;
  return tree;
}
