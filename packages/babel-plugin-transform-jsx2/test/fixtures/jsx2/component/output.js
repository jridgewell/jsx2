function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [before, jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, jsx2.templateResult(_template2(jsx2.createElement), [text]), "second", jsx2.templateResult(_template3(jsx2.createElement), []), fourth, jsx2.templateResult(_template4(jsx2.createElement), [fifth]), [...sixth]), after]);
}

function _template(createElement) {
  const tree = createElement("div", null, createElement("before", null, 0), 1, createElement("after", null, 2));

  _template = () => tree;

  return tree;
}

function _template2(createElement) {
  const tree = createElement("first", null, 0);

  _template2 = () => tree;

  return tree;
}

function _template3(createElement) {
  const tree = createElement("third", {
    third: "third"
  });

  _template3 = () => tree;

  return tree;
}

function _template4(createElement) {
  const tree = createElement("fifth", {
    fifth: 0
  });

  _template4 = () => tree;

  return tree;
}
