function test() {
  const ref = {};
  return jsx2.templateResult(_template(), [jsx2.createElement(Component, {
    ref: ref
  })], 0);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"div\",\"children\":[0]}");

  _template = () => tree;

  return tree;
}
