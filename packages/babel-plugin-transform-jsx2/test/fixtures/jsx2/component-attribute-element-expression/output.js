function test() {
  return jsx2.createElement(Component, {
    attr: jsx2.templateResult(_template(), [x], 0)
  }, void 0);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"inner\",\"children\":[0]}");

  _template = () => tree;

  return tree;
}
