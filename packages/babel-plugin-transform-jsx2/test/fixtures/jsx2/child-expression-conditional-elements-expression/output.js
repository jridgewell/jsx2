function test() {
  return jsx2.templateResult(_template(), [cond && jsx2.templateResult(_template2(), [x], 1)], 1);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":[1]}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":"inner","key":"","ref":null,"props":{"children":[1]}}`);

  _template2 = () => tree;

  return tree;
}
