function test() {
  return jsx2.template(_template(jsx2), []);
}

function _template(jsx2) {
  const tree = jsx2.createElement("div", null, null, {
    "xml:foo": true
  });

  _template = () => tree;

  return tree;
}
