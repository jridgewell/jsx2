function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [jsx2.Fragment, x]);
}

function _template(createElement) {
  const tree = createElement(0, null, [1]);

  _template = () => tree;

  return tree;
}
