var _templateBlock = require("jsx2").templateBlock;
var _createElement = require("jsx2").createElement;
function test() {
  return _templateBlock(_template(), [_createElement(Component, {
    before: true,
    ...s,
    after: true
  }, "text")]);
}
function _template() {
  const tree = _createElement("div", null, 0);
  _template = () => tree;
  return tree;
}
