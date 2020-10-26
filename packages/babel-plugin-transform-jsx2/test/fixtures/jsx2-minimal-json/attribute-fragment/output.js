var _Fragment = require("jsx2").Fragment;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [_templateResult(_template2(), [_Fragment])]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"attr":0}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":0}`);

  _template2 = () => tree;

  return tree;
}
