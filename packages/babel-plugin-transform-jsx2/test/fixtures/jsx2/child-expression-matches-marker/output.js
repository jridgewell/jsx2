var _templateBlock = require("jsx2").templateBlock;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateBlock(_template(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, expression]);
}

function _template() {
  const tree = _createElement("div", null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

  _template = () => tree;

  return tree;
}
