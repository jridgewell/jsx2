var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), []);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"xml:foo":true}}`);
  _template = () => tree;
  return tree;
}
