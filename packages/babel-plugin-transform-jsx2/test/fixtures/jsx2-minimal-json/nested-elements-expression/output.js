var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock(_template(), [x]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":{"type":"inner","props":{"children":0}}}}`);

  _template = () => tree;

  return tree;
}
