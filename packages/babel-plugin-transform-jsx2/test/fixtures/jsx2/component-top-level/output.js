var _templateBlock = require("jsx2").templateBlock;

var _createElement = require("jsx2").createElement;

function test() {
  return _createElement(Component, {
    id: foo,
    bar: bar
  }, _templateBlock(_template(), [text]), "second", _templateBlock(_template2(), []), fourth, _templateBlock(_template3(), [fifth]), [...sixth]);
}

function _template() {
  const tree = _createElement("first", null, 0);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = _createElement("third", {
    third: "third"
  });

  _template2 = () => tree;

  return tree;
}

function _template3() {
  const tree = _createElement("fifth", {
    fifth: 0
  });

  _template3 = () => tree;

  return tree;
}
