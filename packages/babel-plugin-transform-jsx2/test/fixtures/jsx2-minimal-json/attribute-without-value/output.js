var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), []);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"attr":true}}`);

  _template = () => tree;

  return tree;
}
