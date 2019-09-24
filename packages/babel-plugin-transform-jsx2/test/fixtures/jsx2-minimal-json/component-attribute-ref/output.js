function test() {
  const ref = {};
  return jsx2.templateResult(_template(), [jsx2.createElement(Component, {
    ref: ref
  })]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":[0]}}`);

  _template = () => tree;

  return tree;
}
