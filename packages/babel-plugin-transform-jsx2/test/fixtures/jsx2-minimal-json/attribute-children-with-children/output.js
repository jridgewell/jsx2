var _templateBlock = require("jsx2").templateBlock;
function test() {
  return _templateBlock(_template(), []);
}
function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":"real children"}}`);
  _template = () => tree;
  return tree;
}
