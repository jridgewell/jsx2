var _templateBlock = require("jsx2").templateBlock;

var _Fragment = require("jsx2").Fragment;

function test() {
  return _templateBlock(_template(), [_Fragment]);
}

function _template() {
  const tree = JSON.parse(`{"type":0,"props":{"children":{"type":"inner"}}}`);

  _template = () => tree;

  return tree;
}
