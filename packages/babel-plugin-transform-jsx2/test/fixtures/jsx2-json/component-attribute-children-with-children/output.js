var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [_createElement(Component, {
    children: "foo"
  }, "real children")]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":0}}`);

  _template = () => tree;

  return tree;
}
