var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [`foo${bar}`]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":["foo",0,"foo3","abc13efalsegnulli","abcd","abcde"]}}`);

  _template = () => tree;

  return tree;
}
