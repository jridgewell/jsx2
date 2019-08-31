function test() {
  const ref = {};
  return jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), [ref]);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement("div", "", expression, null);

  _template = () => tree;

  return tree;
}
