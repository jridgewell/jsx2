function test() {
  return jsx2.template(_template(jsx2), [x]);
}

function _template(jsx2) {
  const tree = jsx2.createElement(jsx2.Fragment, null, null, {
    children: [jsx2.expression]
  });

  _template = () => tree;

  return tree;
}
