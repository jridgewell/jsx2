var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _createElement(Component, {
    id: foo,
    bar: bar
  }, _templateResult(_template(), [text]), "second", _templateResult(_template2(), []), fourth, _templateResult(_template3(), [fifth]), [...sixth]);
}

function _template() {
  const tree = JSON.parse(`{"type":"first","key":"","ref":null,"props":{"children":0}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":"third","key":"","ref":null,"props":{"third":"third"}}`);

  _template2 = () => tree;

  return tree;
}

function _template3() {
  const tree = JSON.parse(`{"type":"fifth","key":"","ref":null,"props":{"fifth":0}}`);

  _template3 = () => tree;

  return tree;
}
