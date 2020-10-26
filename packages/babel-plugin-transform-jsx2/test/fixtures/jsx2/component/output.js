var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateResult(_template(), [before, _createElement(Component, {
    id: foo,
    bar: bar
  }, _templateResult(_template2(), [text]), "second", _templateResult(_template3(), []), fourth, _templateResult(_template4(), [fifth]), [...sixth]), after]);
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
