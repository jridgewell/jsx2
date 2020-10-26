var _templateBlock = require("jsx2").templateBlock;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateBlock(_template(), [[1]]);
}

function _template() {
  const tree = _createElement("div", {
    attr: 0
  });

  _template = () => tree;

  return tree;
}
