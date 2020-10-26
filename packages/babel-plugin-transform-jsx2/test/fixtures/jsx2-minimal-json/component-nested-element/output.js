var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [_createElement(Component, null, _templateResult(_template2(), [foo, bar, x]))]);
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
