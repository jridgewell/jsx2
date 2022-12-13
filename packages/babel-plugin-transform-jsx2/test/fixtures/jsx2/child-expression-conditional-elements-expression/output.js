var _templateBlock = require("jsx2").templateBlock;
var _createElement = require("jsx2").createElement;
function test() {
  return _templateBlock(_template(), [cond && _templateBlock(_template2(), [x])]);
}
function _template() {
  const tree = _createElement("div", null, 0);
  _template = () => tree;
  return tree;
}
function _template2() {
  const tree = _createElement("inner", null, 0);
  _template2 = () => tree;
  return tree;
}
