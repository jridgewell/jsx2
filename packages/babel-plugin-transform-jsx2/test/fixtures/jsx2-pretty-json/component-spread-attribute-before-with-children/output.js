var _createElement = require("jsx2").createElement;

var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock(_template(), [_createElement(Component, {
    before: true,
    ...s
  }, "text")]);
}

function _template() {
  const tree = JSON.parse(`{
  "type": "div",
  "key": "",
  "ref": null,
  "props": {
    "children": 0
  }
}`);

  _template = () => tree;

  return tree;
}
