var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [_createElement(Component, { ...s,
    after: true
  }, "text")]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);

  _template = () => tree;

  return tree;
}
