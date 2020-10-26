var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock(_template(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, expression]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":[0,1,2,3,4,5,6,7,8,9,10]}}`);

  _template = () => tree;

  return tree;
}
