function test() {
  return jsx2.templateResult(_template(), [id, jsx2.Fragment]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"id":0,"children":[{"type":1,"key":"","ref":null,"props":null},{"type":1,"key":"","ref":null,"props":null},{"type":1,"key":"","ref":null,"props":null}]}}`);

  _template = () => tree;

  return tree;
}
