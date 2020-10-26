var _templateResult = require("jsx2").templateResult;

var _createElement = require("jsx2").createElement;

function test() {
  return _templateResult(_template(), [`foo${bar}`]);
}

function _template() {
  const tree = _createElement("div", null, `foo`, 0, `foo${3}`, `a${'b'}c${0xd}e${false}g${null}i`, `a${`bc`}d`, `a${`b${'c'}d`}e`);

  _template = () => tree;

  return tree;
}
