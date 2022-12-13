var _templateBlock = require("jsx2").templateBlock;
var _createElement = require("jsx2").createElement;
var _Fragment = require("jsx2").Fragment;
function test() {
  return _templateBlock(_template(), []);
}
function _template() {
  const tree = _createElement(_Fragment, null, _createElement("inner", null));
  _template = () => tree;
  return tree;
}
