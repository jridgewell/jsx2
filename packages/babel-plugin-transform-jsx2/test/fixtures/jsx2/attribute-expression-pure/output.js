function test() {
  return jsx2.template(_template(jsx2), [[1]]);
}

function _template(jsx2) {
  const tree = jsx2.createElement("div", null, null, {
    attr: jsx2.expression
  });

  _template = () => tree;

  return tree;
}
