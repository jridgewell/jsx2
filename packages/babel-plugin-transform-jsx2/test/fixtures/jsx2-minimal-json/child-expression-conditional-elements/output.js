var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [cond ? _templateBlock(_template2(), []) : _templateBlock(_template3(), [])]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);
  _template = () => tree;
  return tree;
}
function _template2() {
  const tree = JSON.parse(`{"type":"t"}`);
  _template2 = () => tree;
  return tree;
}
function _template3() {
  const tree = JSON.parse(`{"type":"f"}`);
  _template3 = () => tree;
  return tree;
}
