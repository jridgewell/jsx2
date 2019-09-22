function test() {
  return jsx2.templateResult(_template(), [id, jsx2.Fragment]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"id":0,"children":[{"type":1},{"type":1},{"type":1}]}}`);

  _template = () => tree;

  return tree;
}
