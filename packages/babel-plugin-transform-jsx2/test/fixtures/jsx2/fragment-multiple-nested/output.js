var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateResult(_template(), []);
}

function _template() {
  const tree = _createElement("div", null, _createElement(_Fragment, null), _createElement(_Fragment, null), _createElement(_Fragment, null));

  _template = () => tree;

  return tree;
}
