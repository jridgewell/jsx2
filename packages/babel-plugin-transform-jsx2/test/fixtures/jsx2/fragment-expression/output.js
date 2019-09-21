function test() {
  return jsx2.templateResult(_template(), [x], 0, 1);
}

function _template() {
  const tree = JSON.parse(`{"type":1,"key":"","ref":null,"props":{"children":[0]}}`);

  _template = () => tree;

  return tree;
}
