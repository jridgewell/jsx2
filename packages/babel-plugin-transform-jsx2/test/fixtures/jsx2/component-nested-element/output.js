var _templateBlock = require("jsx2").templateBlock;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateBlock(_template(), [_createElement(Component, null, _templateBlock(_template2(), [foo, bar, x]))]);
}

function _template() {
  const tree = _createElement("div", null, 0);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = _createElement("inner", [{
    foo: 0
  }, 1], 2);

  _template2 = () => tree;

  return tree;
}
