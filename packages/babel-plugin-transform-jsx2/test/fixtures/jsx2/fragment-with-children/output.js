function test() {
  return jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), []);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement(Fragment, null, null, {
    children: [createElement("inner", null, null, null)]
  });

  _template = () => tree;

  return tree;
}
