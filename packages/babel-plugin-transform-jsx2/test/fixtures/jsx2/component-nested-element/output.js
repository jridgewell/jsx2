function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [jsx2.createElement(Component, null, jsx2.templateResult(_template2(jsx2.createElement), [foo, bar, x]))]);
}

function _template(createElement) {
  const tree = createElement("div", null, 0);

  _template = () => tree;

  return tree;
}

function _template2(createElement) {
  const tree = createElement("inner", [{
    foo: 0
  }, 1], 2);

  _template2 = () => tree;

  return tree;
}
