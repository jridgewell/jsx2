function test() {
  return jsx2.template(_template(jsx2), [jsx2.createElement(Component, null, null, [s, {
    after: true,
    children: [jsx2.template(_template2(jsx2), [])]
  }])]);
}

function _template(jsx2) {
  const tree = jsx2.createElement("div", null, null, {
    children: [jsx2.expression]
  });

  _template = () => tree;

  return tree;
}

function _template2(jsx2) {
  const tree = jsx2.createElement(jsx2.Fragment, null, null, {
    children: ["text"]
  });

  _template2 = () => tree;

  return tree;
}
