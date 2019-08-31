function test() {
  return jsx2.template(_template(jsx2), [s]);
}

function _template(jsx2) {
  const tree = jsx2.createElement("div", null, null, [jsx2.expression, {
    after: true
  }]);

  _template = () => tree;

  return tree;
}
