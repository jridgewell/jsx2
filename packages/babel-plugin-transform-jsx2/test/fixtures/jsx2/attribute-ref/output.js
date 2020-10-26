var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

function test() {
  const ref = {};
  return _templateResult(_template(), [ref]);
}

function _template() {
  const tree = _createElement("div", {
    ref: 0
  });

  _template = () => tree;

  return tree;
}
