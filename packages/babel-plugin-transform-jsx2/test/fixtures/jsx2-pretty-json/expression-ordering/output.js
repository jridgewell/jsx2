var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock(_template(), [first_children, second_key, third_ref, fourth_static_child]);
}

function _template() {
  const tree = JSON.parse(`{
  "type": "div",
  "key": 1,
  "ref": 2,
  "props": {
    "children": 0,
    "children": 3
  }
}`);

  _template = () => tree;

  return tree;
}
