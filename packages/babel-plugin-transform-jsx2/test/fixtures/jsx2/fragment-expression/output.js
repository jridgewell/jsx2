var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateResult(_template(), [x]);
}

function _template() {
  const tree = _createElement(_Fragment, null, 0);

  _template = () => tree;

  return tree;
}
