function test() {
  const ref = {};
  return jsx2.templateResult(_template(jsx2.createElement), [jsx2.createElement(Component, {
    ref: ref
  })]);
}

function _template(createElement) {
  const tree = createElement("div", null, [0]);

  _template = () => tree;

  return tree;
}
