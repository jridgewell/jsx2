var _templateBlock = require("jsx2").templateBlock;
var _createElement = require("jsx2").createElement;
var _Fragment = require("jsx2").Fragment;
function test() {
  return _templateBlock(_template(), [id]);
}
function _template() {
  const tree = _createElement("div", {
    id: 0
  }, _createElement(_Fragment, null), _createElement(_Fragment, null), _createElement(_Fragment, null));
  _template = () => tree;
  return tree;
}
