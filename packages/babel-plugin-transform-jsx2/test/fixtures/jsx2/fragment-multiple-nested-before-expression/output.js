function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [jsx2.Fragment, id]);
}

function _template(createElement) {
  const tree = createElement("div", null, createElement(0, null), createElement(0, null), createElement(0, null), 1);

  _template = () => tree;

  return tree;
}
