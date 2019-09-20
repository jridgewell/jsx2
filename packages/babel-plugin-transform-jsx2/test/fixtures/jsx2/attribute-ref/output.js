function test() {
  const ref = {};
  return jsx2.templateResult(_template(), [ref], 0);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"div\",\"props\":{\"ref\":0}}");

  _template = () => tree;

  return tree;
}
