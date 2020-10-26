var _templateResult = require("jsx2").templateResult;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateResult(_template(), [_Fragment, x]);
}

function _template() {
  const tree = JSON.parse(`{"type":0,"props":{"children":1}}`);

  _template = () => tree;

  return tree;
}
