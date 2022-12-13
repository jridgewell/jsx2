var _createElement = require("jsx2").createElement;
var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _createElement(Component, {
    attr: _templateBlock(_template(), [])
  });
}
function _template() {
  const tree = JSON.parse(`{
  "type": "inner",
  "key": "",
  "ref": null,
  "props": null
}`);
  _template = () => tree;
  return tree;
}
