function test() {
  return jsx2.templateResult(_template(), [cond ? true : false], 0);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"attr":0}}`);

  _template = () => tree;

  return tree;
}
