var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

function test() {
  return _createElement(Component, {
    id: foo,
    bar: bar
  }, _templateResult(_template(), [text]), "second", _templateResult(_template2(), []), fourth, _templateResult(_template3(), [fifth]), [...sixth]);
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
