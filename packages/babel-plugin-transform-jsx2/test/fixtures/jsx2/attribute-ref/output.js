var _templateBlock = require("jsx2").templateBlock;

var _createElement = require("jsx2").createElement;

function test() {
  const ref = {};
  return _templateBlock(_template(), [ref]);
}

function _template() {
  const tree = _createElement("div", {
    ref: 0
  });

  _template = () => tree;

  return tree;
}
