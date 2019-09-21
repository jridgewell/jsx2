function test() {
  const ref = {};
  return jsx2.templateResult(_template(), [ref], 1);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":1,"props":null}`);

  _template = () => tree;

  return tree;
}
