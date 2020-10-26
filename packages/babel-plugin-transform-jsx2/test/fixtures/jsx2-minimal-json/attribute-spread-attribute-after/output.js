var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock(_template(), [s]);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":[0,{"after":true}]}`);

  _template = () => tree;

  return tree;
}
