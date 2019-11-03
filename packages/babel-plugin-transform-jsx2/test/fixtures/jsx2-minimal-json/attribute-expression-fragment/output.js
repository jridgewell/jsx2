function test() {
  return jsx2.templateResult(_template(), [jsx2.templateResult(_template2(), [jsx2.Fragment])]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"attr":0}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":0}`);

  _template2 = () => tree;

  return tree;
}
