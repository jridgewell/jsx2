function test() {
  const ref = {};
  return jsx2.templateResult(_template(), [ref], 0);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":0,"props":null}`);

  _template = () => tree;

  return tree;
}
