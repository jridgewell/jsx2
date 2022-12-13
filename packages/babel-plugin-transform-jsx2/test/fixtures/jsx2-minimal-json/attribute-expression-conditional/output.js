var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [cond ? true : false]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"attr":0}}`);
  _template = () => tree;
  return tree;
}
