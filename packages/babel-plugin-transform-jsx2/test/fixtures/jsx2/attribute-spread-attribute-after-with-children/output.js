var _templateBlock = require("jsx2").templateBlock;
var _createElement = require("jsx2").createElement;
function test() {
  return _templateBlock(_template(), [s]);
}
function _template() {
  const tree = _createElement("div", [0, {
    after: true
  }], "text");
  _template = () => tree;
  return tree;
}
