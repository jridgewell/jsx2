function test() {
  return jsx2.templateResult(_template(), [[1]], 0);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"div\",\"children\":[0]}");

  _template = () => tree;

  return tree;
}
