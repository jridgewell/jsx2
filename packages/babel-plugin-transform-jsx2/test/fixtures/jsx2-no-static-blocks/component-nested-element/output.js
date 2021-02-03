var _createElement = require("jsx2").createElement;

function test() {
  return _createElement("div", null, _createElement(Component, null, _createElement("inner", {
    foo: foo,
    ...bar
  }, x)));
}
