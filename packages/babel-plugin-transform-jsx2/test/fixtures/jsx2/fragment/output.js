function test() {
  return jsx2.templateResult(_template(), [], void 0, 0);
}

function _template() {
  const tree = JSON.parse(`{"type":0,"key":"","ref":null,"props":null}`);

  _template = () => tree;

  return tree;
}
