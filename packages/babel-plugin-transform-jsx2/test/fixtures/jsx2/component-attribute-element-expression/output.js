var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

function test() {
  return _createElement(Component, {
    attr: _templateResult(_template(), [x])
  });
}

function _template() {
  const tree = _createElement("inner", null, 0);

  _template = () => tree;

  return tree;
}
