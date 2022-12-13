var _templateBlock = require("jsx2").templateBlock;
var _createElement = require("jsx2").createElement;
function test() {
  return _templateBlock(_template(), [cond ? _templateBlock(_template2(), []) : _templateBlock(_template3(), [])]);
}
function _template() {
  const tree = _createElement("div", {
    attr: 0
  });
  _template = () => tree;
  return tree;
}
function _template2() {
  const tree = _createElement("t", null);
  _template2 = () => tree;
  return tree;
}
function _template3() {
  const tree = _createElement("f", null);
  _template3 = () => tree;
  return tree;
}
