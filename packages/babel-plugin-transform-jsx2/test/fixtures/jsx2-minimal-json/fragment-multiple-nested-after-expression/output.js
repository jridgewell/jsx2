var _templateResult = require("jsx2").templateResult;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateResult(_template(), [id, _Fragment]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"id":0,"children":[{"type":1},{"type":1},{"type":1}]}}`);

  _template = () => tree;

  return tree;
}
