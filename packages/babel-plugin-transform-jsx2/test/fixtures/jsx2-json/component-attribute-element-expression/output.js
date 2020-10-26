var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _createElement(Component, {
    attr: _templateResult(_template(), [x])
  });
}

function _template() {
  const tree = JSON.parse(`{"type":"inner","key":"","ref":null,"props":{"children":0}}`);

  _template = () => tree;

  return tree;
}
