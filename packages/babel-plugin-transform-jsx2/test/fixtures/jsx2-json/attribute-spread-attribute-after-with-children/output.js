function test() {
  return jsx2.templateResult(_template(), [s]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":[0,{"after":true,"children":["text"]}]}`);

  _template = () => tree;

  return tree;
}
