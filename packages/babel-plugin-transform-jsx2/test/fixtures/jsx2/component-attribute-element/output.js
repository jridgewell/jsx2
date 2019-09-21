function test() {
  return jsx2.createElement(Component, {
    attr: jsx2.templateResult(_template(), [])
  });
}

function _template() {
  const tree = JSON.parse(`{"type":"inner","key":"","ref":null,"props":null}`);

  _template = () => tree;

  return tree;
}
