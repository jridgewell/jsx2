var _createElement = require("jsx2").createElement;
function test() {
  return _createElement("div", null, `foo`, `foo${bar}`, `foo${3}`, `a${'b'}c${0xd}e${false}g${null}i`, `a${`bc`}d`, `a${`b${'c'}d`}e`);
}
