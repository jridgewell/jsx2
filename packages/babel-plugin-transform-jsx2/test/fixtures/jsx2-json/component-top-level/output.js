var _createElement = require("jsx2").createElement;

var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _createElement(Component, {
    id: foo,
    bar: bar
  }, _templateBlock(_template(), [text]), "second", _templateBlock(_template2(), []), fourth, _templateBlock(_template3(), [fifth]), [...sixth]);
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
