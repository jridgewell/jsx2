var _templateBlock = require("jsx2").templateBlock;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateBlock(_template(), [s]);
}

function _template() {
  const tree = _createElement("div", [{
    before: true
  }, 0], "text");

  _template = () => tree;

  return tree;
}
