var _createElement = require("jsx2").createElement;

function test() {
  return _createElement("div", null, cond ? _createElement("t", null) : _createElement("f", null));
}
