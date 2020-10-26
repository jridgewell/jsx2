var _templateResult = require("jsx2").templateResult;

function test() {
  const ref = {};
  return _templateResult(_template(), [ref]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":0,"props":null}`);

  _template = () => tree;

  return tree;
}
