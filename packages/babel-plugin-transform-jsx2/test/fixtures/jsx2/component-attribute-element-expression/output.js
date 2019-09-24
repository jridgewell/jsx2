function test() {
  return jsx2.createElement(Component, {
    attr: jsx2.templateResult(_template(jsx2.createElement), [x])
  });
}

function _template(createElement) {
  const tree = createElement("inner", null, [0]);

  _template = () => tree;

  return tree;
}
