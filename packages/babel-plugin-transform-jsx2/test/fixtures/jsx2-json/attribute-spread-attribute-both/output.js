var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [s]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":[{"before":true},0,{"after":true}]}`);
  _template = () => tree;
  return tree;
}
