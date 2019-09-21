function test() {
  return jsx2.templateResult(_template(), [jsx2.createElement(Component, {
    attr: x
  })], 0);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":[0]}}`);

  _template = () => tree;

  return tree;
}
