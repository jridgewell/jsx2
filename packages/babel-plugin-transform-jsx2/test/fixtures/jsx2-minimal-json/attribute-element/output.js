var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [_templateResult(_template2(), [])]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"attr":0}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":"inner"}`);

  _template2 = () => tree;

  return tree;
}
