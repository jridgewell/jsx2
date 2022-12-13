var _templateBlock = require("jsx2").templateBlock;
function test() {
  const ref = {};
  return _templateBlock(_template(), [ref]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","ref":0}`);
  _template = () => tree;
  return tree;
}
