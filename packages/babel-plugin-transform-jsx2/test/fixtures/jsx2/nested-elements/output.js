function test() {
  return jsx2.templateResult(_template(), []);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"div\",\"children\":[{\"type\":\"inner\"}]}");

  _template = () => tree;

  return tree;
}
