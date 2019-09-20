function test() {
  return jsx2.templateResult(_template(), [s], 0);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"div\",\"props\":[{\"before\":true},0]}");

  _template = () => tree;

  return tree;
}
