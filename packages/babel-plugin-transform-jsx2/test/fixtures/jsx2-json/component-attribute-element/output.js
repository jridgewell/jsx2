var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _createElement(Component, {
    attr: _templateResult(_template(), [])
  });
}

function _template() {
  const tree = JSON.parse(`{"type":"inner","key":"","ref":null,"props":null}`);

  _template = () => tree;

  return tree;
}
