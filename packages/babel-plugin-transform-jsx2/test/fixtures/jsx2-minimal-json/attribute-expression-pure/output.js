var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [[1]]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"attr":0}}`);

  _template = () => tree;

  return tree;
}
