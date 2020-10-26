var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [cond ? _templateResult(_template2(), []) : _templateResult(_template3(), [])]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":"t"}`);

  _template2 = () => tree;

  return tree;
}

function _template3() {
  const tree = JSON.parse(`{"type":"f"}`);

  _template3 = () => tree;

  return tree;
}
