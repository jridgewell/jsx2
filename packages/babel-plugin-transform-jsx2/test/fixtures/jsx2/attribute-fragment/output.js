function test() {
  return jsx2.templateResult(_template(), [jsx2.Fragment]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"attr":{"type":0,"key":"","ref":null,"props":null}}}`);

  _template = () => tree;

  return tree;
}
