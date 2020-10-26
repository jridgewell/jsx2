var _templateBlock = require("jsx2").templateBlock;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateBlock(_template(), [before, _createElement(Component, {
    id: foo,
    bar: bar
  }, _templateBlock(_template2(), [text]), "second", _templateBlock(_template3(), []), fourth, _templateBlock(_template4(), [fifth]), [...sixth]), after]);
}

function _template() {
  const tree = _createElement("div", null, _createElement("before", null, 0), 1, _createElement("after", null, 2));

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = _createElement("first", null, 0);

  _template2 = () => tree;

  return tree;
}

function _template3() {
  const tree = _createElement("third", {
    third: "third"
  });

  _template3 = () => tree;

  return tree;
}

function _template4() {
  const tree = _createElement("fifth", {
    fifth: 0
  });

  _template4 = () => tree;

  return tree;
}
