var _templateBlock = require("jsx2").templateBlock;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateBlock(_template(), []);
}

function _template() {
  const tree = _createElement("div", {
    children: "foo"
  }, "real children");

  _template = () => tree;

  return tree;
}
