function test() {
  return jsx2.template(_template(jsx2), []);
}

function _template(jsx2) {
  const tree = jsx2.createElement("div", null, null, {
    children: ["real children"]
  });

  _template = () => tree;

  return tree;
}
