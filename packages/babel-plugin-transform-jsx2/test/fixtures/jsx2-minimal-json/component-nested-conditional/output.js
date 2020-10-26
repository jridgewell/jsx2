var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [_createElement(Component, {
    id: foo,
    bar: bar
  }, true && _templateResult(_template2(), []))]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":"div"}`);

  _template2 = () => tree;

  return tree;
}
