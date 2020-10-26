var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), []);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"key","ref":null,"props":null}`);

  _template = () => tree;

  return tree;
}
