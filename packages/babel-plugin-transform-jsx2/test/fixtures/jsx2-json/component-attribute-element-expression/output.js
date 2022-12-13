var _createElement = require("jsx2").createElement;
var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _createElement(Component, {
    attr: _templateBlock(_template(), [x])
  });
}
function _template() {
  const tree = JSON.parse(`{"type":"inner","key":"","ref":null,"props":{"children":0}}`);
  _template = () => tree;
  return tree;
}
