function test() {
  return jsx2.createElement(Component, {
    attr: jsx2.templateResult(_template(), [x])
  });
}

function _template() {
  const tree = JSON.parse(`{"type":"inner","key":"","ref":null,"props":{"children":0}}`);

  _template = () => tree;

  return tree;
}
