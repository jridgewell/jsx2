function test() {
  return jsx2.templateResult(_template(), []);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":"text"}}`);

  _template = () => tree;

  return tree;
}
