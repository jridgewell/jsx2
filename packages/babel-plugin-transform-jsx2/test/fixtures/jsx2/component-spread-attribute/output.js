function test() {
  return jsx2.template(_template(jsx2), [jsx2.createElement(Component, null, null, [s])]);
}

function _template(jsx2) {
  const tree = jsx2.createElement("div", null, null, {
    children: [jsx2.expression]
  });

  _template = () => tree;

  return tree;
}
