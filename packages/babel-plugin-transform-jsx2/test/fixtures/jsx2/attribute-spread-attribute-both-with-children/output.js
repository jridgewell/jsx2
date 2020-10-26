var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateResult(_template(), [s]);
}

function _template() {
  const tree = _createElement("div", [{
    before: true
  }, 0, {
    after: true
  }], "text");

  _template = () => tree;

  return tree;
}
