function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, expression]);
}

function _template(createElement) {
  const tree = createElement("div", null, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

  _template = () => tree;

  return tree;
}
