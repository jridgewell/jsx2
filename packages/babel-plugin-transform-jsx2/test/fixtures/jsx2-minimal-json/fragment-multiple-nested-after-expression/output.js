var _templateBlock = require("jsx2").templateBlock;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateBlock(_template(), [id, _Fragment]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"id":0,"children":[{"type":1},{"type":1},{"type":1}]}}`);

  _template = () => tree;

  return tree;
}
