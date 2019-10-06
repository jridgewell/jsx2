function test() {
  return jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, jsx2.templateResult(_template(jsx2.createElement), [text]), "second", jsx2.templateResult(_template2(jsx2.createElement), []), fourth, jsx2.templateResult(_template3(jsx2.createElement), [fifth]), [...sixth]);
}

function _template(createElement) {
  const tree = createElement("first", null, 0);

  _template = () => tree;

  return tree;
}

function _template2(createElement) {
  const tree = createElement("third", {
    third: "third"
  });

  _template2 = () => tree;

  return tree;
}

function _template3(createElement) {
  const tree = createElement("fifth", {
    fifth: 0
  });

  _template3 = () => tree;

  return tree;
}
