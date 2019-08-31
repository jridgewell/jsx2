function test() {
  const ref = {};
  return jsx2.template(_template(jsx2), [ref]);
}

function _template(jsx2) {
  const tree = jsx2.createElement("div", null, jsx2.expression, null);

  _template = () => tree;

  return tree;
}
