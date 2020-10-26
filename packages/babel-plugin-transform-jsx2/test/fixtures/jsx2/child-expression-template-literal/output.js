var _templateBlock = require("jsx2").templateBlock;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateBlock(_template(), [`foo${bar}`]);
}

function _template() {
  const tree = _createElement("div", null, `foo`, 0, `foo${3}`, `a${'b'}c${0xd}e${false}g${null}i`, `a${`bc`}d`, `a${`b${'c'}d`}e`);

  _template = () => tree;

  return tree;
}
