function test() {
  return jsx2.templateResult(_template(), [cond ? jsx2.templateResult(_template2(), []) : jsx2.templateResult(_template3(), [])]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":[0]}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":"t","key":"","ref":null,"props":null}`);

  _template2 = () => tree;

  return tree;
}

function _template3() {
  const tree = JSON.parse(`{"type":"f","key":"","ref":null,"props":null}`);

  _template3 = () => tree;

  return tree;
}
