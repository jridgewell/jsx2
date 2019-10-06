function test() {
  return jsx2.templateResult(_template(), [jsx2.Fragment]);
}

function _template() {
  const tree = JSON.parse(`{"type":0,"props":{"children":{"type":"inner"}}}`);

  _template = () => tree;

  return tree;
}
