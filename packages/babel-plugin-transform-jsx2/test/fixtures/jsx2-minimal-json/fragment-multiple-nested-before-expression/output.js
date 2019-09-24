function test() {
  return jsx2.templateResult(_template(), [jsx2.Fragment, id]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":[{"type":0},{"type":0},{"type":0},1]}}`);

  _template = () => tree;

  return tree;
}
