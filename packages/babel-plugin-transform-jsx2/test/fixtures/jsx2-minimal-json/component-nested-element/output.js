function test() {
  return jsx2.templateResult(_template(), [jsx2.createElement(Component, null, jsx2.templateResult(_template2(), [foo, bar, x]))]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":0}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":"inner","props":[{"foo":0},1,{"children":2}]}`);

  _template2 = () => tree;

  return tree;
}
