function test() {
  return jsx2.templateResult(_template(), [cond ? true : false]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"attr":0}}`);

  _template = () => tree;

  return tree;
}
