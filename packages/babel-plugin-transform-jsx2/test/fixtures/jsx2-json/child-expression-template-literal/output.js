function test() {
  return jsx2.templateResult(_template(), [`foo${bar}`]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":["foo",0,"foo3","abc13efalsegnulli","abcd","abcde"]}}`);

  _template = () => tree;

  return tree;
}
