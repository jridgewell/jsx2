var _templateBlock = require("jsx2").templateBlock;
var _createElement = require("jsx2").createElement;
function test() {
  return _templateBlock(_template(), [_createElement(Component, {
    children: "foo"
  }, "real children")]);
}
function _template() {
  const tree = _createElement("div", null, 0);
  _template = () => tree;
  return tree;
}
