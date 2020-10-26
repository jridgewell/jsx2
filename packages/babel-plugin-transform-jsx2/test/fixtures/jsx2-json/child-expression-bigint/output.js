var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [1n]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":0}}`);

  _template = () => tree;

  return tree;
}
