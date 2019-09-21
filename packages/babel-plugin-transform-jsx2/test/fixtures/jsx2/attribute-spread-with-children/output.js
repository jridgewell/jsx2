function test() {
  return jsx2.templateResult(_template(), [s], 1);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":[1,{"children":["text"]}]}`);

  _template = () => tree;

  return tree;
}
