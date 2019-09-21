function test() {
  return jsx2.templateResult(_template(), [], void 0, 1);
}

function _template() {
  const tree = JSON.parse(`{"type":1,"key":"","ref":null,"props":{"children":[{"type":"inner","key":"","ref":null,"props":null}]}}`);

  _template = () => tree;

  return tree;
}
