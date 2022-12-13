var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [s]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","props":[{"before":true},0,{"children":"text"}]}`);
  _template = () => tree;
  return tree;
}
