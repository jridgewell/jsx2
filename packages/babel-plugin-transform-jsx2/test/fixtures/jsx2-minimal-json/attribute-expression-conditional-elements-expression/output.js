var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [cond && _templateResult(_template2(), [x])]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"attr":0}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":"inner","props":{"children":0}}`);

  _template2 = () => tree;

  return tree;
}
