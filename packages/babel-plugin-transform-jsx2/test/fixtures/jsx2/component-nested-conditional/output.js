function test() {
  return jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), [jsx2.createElement(Component, null, null, {
    id: foo,
    bar: bar,
    children: [jsx2.template(_template2(jsx2.createElement, jsx2.expression, jsx2.Fragment), [true && jsx2.template(_template3(jsx2.createElement, jsx2.expression, jsx2.Fragment), [])])]
  })]);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement("div", null, null, {
    children: [expression]
  });

  _template = () => tree;

  return tree;
}

function _template2(createElement, expression, Fragment) {
  const tree = createElement(Fragment, null, null, {
    children: [expression]
  });

  _template2 = () => tree;

  return tree;
}

function _template3(createElement, expression, Fragment) {
  const tree = createElement("div", null, null, null);

  _template3 = () => tree;

  return tree;
}
