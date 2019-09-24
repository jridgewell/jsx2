function test() {
  const ref = {};
  return jsx2.templateResult(_template(), [ref]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","ref":0}`);

  _template = () => tree;

  return tree;
}
