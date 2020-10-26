var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [s]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":0}`);

  _template = () => tree;

  return tree;
}
