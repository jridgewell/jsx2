function test() {
  const ref = {};
  return jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), [jsx2.createElement(Component, null, ref, null)]);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement("div", null, null, {
    children: [expression]
  });

  _template = () => tree;

  return tree;
}
