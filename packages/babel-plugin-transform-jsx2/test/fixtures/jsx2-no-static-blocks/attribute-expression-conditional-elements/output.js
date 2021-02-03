var _createElement = require("jsx2").createElement;

function test() {
  return _createElement("div", {
    attr: cond ? _createElement("t", null) : _createElement("f", null)
  });
}
