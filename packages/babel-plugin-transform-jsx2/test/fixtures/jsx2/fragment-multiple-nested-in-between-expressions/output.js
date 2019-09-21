function test() {
  return jsx2.templateResult(_template(), [jsx2.Fragment, id]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":[{"type":0,"key":"","ref":null,"props":null},{"type":0,"key":"","ref":null,"props":null},1,{"type":0,"key":"","ref":null,"props":null}]}}`);

  _template = () => tree;

  return tree;
}
