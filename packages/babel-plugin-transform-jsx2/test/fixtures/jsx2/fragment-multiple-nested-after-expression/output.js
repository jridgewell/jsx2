var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateResult(_template(), [id, _Fragment]);
}

function _template() {
  const tree = _createElement("div", {
    id: 0
  }, _createElement(1, null), _createElement(1, null), _createElement(1, null));

  _template = () => tree;

  return tree;
}
