function test() {
  return jsx2.templateResult(_template(), [jsx2.Fragment]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":{"type":0}}}`);

  _template = () => tree;

  return tree;
}
