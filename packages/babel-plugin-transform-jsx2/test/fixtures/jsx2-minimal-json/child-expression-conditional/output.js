var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [cond ? t : f]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);

  _template = () => tree;

  return tree;
}
