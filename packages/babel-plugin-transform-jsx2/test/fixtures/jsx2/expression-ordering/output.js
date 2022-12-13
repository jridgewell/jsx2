var _templateBlock = require("jsx2").templateBlock;
var _createElement = require("jsx2").createElement;
function test() {
  return _templateBlock(_template(), [first_children, second_ref, third_key, fourth_static_child]);
}
function _template() {
  const tree = _createElement("div", {
    children: 0,
    ref: 1,
    key: 2
  }, 3);
  _template = () => tree;
  return tree;
}
