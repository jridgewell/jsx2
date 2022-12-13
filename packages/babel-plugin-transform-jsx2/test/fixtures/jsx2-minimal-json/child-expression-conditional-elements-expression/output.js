var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [cond && _templateBlock(_template2(), [x])]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);
  _template = () => tree;
  return tree;
}
function _template2() {
  const tree = JSON.parse(`{"type":"inner","props":{"children":0}}`);
  _template2 = () => tree;
  return tree;
}
