function test() {
  return jsx2.templateResult(_template(), [], void 0, 0);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"div\",\"children\":[{\"type\":0}]}");

  _template = () => tree;

  return tree;
}
