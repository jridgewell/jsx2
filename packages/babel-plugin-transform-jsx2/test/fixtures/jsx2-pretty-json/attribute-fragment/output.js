var _Fragment = require("jsx2").Fragment;

var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock(_template(), [_templateBlock(_template2(), [_Fragment])]);
}

function _template() {
  const tree = JSON.parse(`{
  "type": "div",
  "key": "",
  "ref": null,
  "props": {
    "attr": 0
  }
}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{
  "type": 0,
  "key": "",
  "ref": null,
  "props": null
}`);

  _template2 = () => tree;

  return tree;
}
