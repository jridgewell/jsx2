var _createElement = require("jsx2").createElement;
function test() {
  return _createElement("div", null, _createElement(Component, {
    id: foo,
    bar: bar
  }, true && _createElement("div", null)));
}
