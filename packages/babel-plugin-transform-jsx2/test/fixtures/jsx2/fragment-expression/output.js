function test() {
  return jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), [x]);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement(Fragment, "", null, {
    children: [expression]
  });

  _template = () => tree;

  return tree;
}
