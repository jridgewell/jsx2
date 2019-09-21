function test() {
  return jsx2.templateResult(_template(), [cond ? true : false], 1);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"attr":1}}`);

  _template = () => tree;

  return tree;
}
