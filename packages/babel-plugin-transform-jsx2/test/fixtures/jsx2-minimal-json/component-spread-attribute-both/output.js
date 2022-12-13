var _createElement = require("jsx2").createElement;
var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), [_createElement(Component, {
    before: true,
    ...s,
    after: true
  })]);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);
  _template = () => tree;
  return tree;
}
