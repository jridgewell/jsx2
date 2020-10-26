var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), [s]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":[{"before":true},0]}`);

  _template = () => tree;

  return tree;
}
