var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [_createElement(Component, null, x)]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);

  _template = () => tree;

  return tree;
}
