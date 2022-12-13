var _templateBlock = require("jsx2").templateBlock;
var _Fragment = require("jsx2").Fragment;
function test() {
  return _templateBlock(_template(), [_Fragment]);
}
function _template() {
  const tree = JSON.parse(`{
  "type": "div",
  "key": "",
  "ref": null,
  "props": {
    "children": {
      "type": 0,
      "key": "",
      "ref": null,
      "props": null
    }
  }
}`);
  _template = () => tree;
  return tree;
}
