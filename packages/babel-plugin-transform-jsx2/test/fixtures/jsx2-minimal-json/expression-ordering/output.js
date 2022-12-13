var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [first_children, second_ref, third_key, fourth_static_child]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","key":2,"ref":1,"props":{"children":3}}`);
  _template = () => tree;
  return tree;
}
