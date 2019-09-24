function test() {
  return jsx2.createElement(Component, {
    attr: jsx2.templateResult(_template(jsx2.createElement), [])
  });
}

function _template(createElement) {
  const tree = createElement("inner", null);

  _template = () => tree;

  return tree;
}
