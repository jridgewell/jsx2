var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [first_children, second_key, third_ref, fourth_static_child]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":1,"ref":2,"props":{"children":0,"children":3}}`);

  _template = () => tree;

  return tree;
}
