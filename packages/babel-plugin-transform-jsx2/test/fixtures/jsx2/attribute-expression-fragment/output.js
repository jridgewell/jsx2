var _Fragment = require("jsx2").Fragment;
var _templateBlock = require("jsx2").templateBlock;
var _createElement = require("jsx2").createElement;
function test() {
  return _templateBlock(_template(), [_templateBlock(_template2(), [])]);
}
function _template() {
  const tree = _createElement("div", {
    attr: 0
  });
  _template = () => tree;
  return tree;
}
function _template2() {
  const tree = _createElement(_Fragment, null);
  _template2 = () => tree;
  return tree;
}
