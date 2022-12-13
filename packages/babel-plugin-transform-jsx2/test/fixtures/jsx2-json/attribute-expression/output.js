var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [x]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"attr":0}}`);
  _template = () => tree;
  return tree;
}
