var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateResult(_template(), []);
}

function _template() {
  const tree = _createElement("div", null, "text");

  _template = () => tree;

  return tree;
}
