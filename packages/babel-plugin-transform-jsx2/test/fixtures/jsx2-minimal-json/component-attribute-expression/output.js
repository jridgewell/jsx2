var _createElement = require("jsx2").createElement;
var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [_createElement(Component, {
    attr: x
  })]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);
  _template = () => tree;
  return tree;
}
