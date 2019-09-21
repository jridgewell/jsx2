function test() {
  return jsx2.templateResult(_template(), [x], 2, 1);
}

function _template() {
  const tree = JSON.parse(`{"type":1,"key":"","ref":null,"props":{"children":[2]}}`);

  _template = () => tree;

  return tree;
}
