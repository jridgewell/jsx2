var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  const ref = {};
  return _templateResult(_template(), [_createElement(Component, {
    ref: ref
  })]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":0}}`);

  _template = () => tree;

  return tree;
}
