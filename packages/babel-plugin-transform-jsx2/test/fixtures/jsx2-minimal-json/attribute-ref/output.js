var _templateResult = require("jsx2").templateResult;

function test() {
  const ref = {};
  return _templateResult(_template(), [ref]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","ref":0}`);

  _template = () => tree;

  return tree;
}
