var _templateResult = require("jsx2").templateResult;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateResult(_template(), [_Fragment, id]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":[{"type":0},{"type":0},{"type":0},1]}}`);

  _template = () => tree;

  return tree;
}
