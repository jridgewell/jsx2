var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateResult(_template(), [first_children, second_key, third_ref, fourth_static_child]);
}

function _template() {
  const tree = _createElement("div", {
    children: 0,
    key: 1,
    ref: 2
  }, 3);

  _template = () => tree;

  return tree;
}
