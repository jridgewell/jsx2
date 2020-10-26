var _templateResult = require("jsx2").templateResult;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateResult(_template(), [_Fragment, id]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":[{"type":0,"key":"","ref":null,"props":null},{"type":0,"key":"","ref":null,"props":null},{"type":0,"key":"","ref":null,"props":null},1]}}`);

  _template = () => tree;

  return tree;
}
