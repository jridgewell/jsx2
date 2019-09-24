function test() {
  return jsx2.templateResult(_template(), []);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"attr":{"type":"inner","key":"","ref":null,"props":null}}}`);

  _template = () => tree;

  return tree;
}
