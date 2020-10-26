var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateResult(_template(), [_Fragment, x]);
}

function _template() {
  const tree = _createElement(0, null, 1);

  _template = () => tree;

  return tree;
}
