function test() {
  return jsx2.templateResult(_template(), [first_children, second_key, third_ref, fourth_static_child]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":1,"ref":2,"props":{"children":0,"children":3}}`);

  _template = () => tree;

  return tree;
}
