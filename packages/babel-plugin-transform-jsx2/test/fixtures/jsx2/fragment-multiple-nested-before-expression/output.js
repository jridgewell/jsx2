var _templateBlock = require("jsx2").templateBlock;

var _createElement = require("jsx2").createElement;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateBlock(_template(), [id]);
}

function _template() {
  const tree = _createElement("div", null, _createElement(_Fragment, null), _createElement(_Fragment, null), _createElement(_Fragment, null), 0);

  _template = () => tree;

  return tree;
}
