var _templateBlock = require("jsx2").templateBlock;
function test() {
  const ref = {};
  return _templateBlock(_template(), [ref]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":0,"props":null}`);
  _template = () => tree;
  return tree;
}
