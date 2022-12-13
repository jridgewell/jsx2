var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), []);
}
function _template() {
  const tree = JSON.parse(`{
  "type": "xml:foo",
  "key": "",
  "ref": null,
  "props": null
}`);
  _template = () => tree;
  return tree;
}
