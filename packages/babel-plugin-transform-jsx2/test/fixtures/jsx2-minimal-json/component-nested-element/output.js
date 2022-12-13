var _createElement = require("jsx2").createElement;
var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [_createElement(Component, null, _templateBlock(_template2(), [foo, bar, x]))]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);
  _template = () => tree;
  return tree;
}
function _template2() {
  const tree = JSON.parse(`{"type":"inner","props":[{"foo":0},1,{"children":2}]}`);
  _template2 = () => tree;
  return tree;
}
