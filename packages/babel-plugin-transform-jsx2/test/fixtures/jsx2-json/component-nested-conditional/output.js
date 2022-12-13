var _createElement = require("jsx2").createElement;
var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [_createElement(Component, {
    id: foo,
    bar: bar
  }, true && _templateBlock(_template2(), []))]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":0}}`);
  _template = () => tree;
  return tree;
}
function _template2() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":null}`);
  _template2 = () => tree;
  return tree;
}
