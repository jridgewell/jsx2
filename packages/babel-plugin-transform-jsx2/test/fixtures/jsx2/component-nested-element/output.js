function test() {
  return jsx2.templateResult(_template(), [jsx2.createElement(Component, null, [jsx2.templateResult(_template2(), [foo, bar, x], 0)])], 0);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"div\",\"children\":[0]}");

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse("{\"type\":\"inner\",\"props\":[{\"foo\":0},0],\"children\":[0]}");

  _template2 = () => tree;

  return tree;
}
