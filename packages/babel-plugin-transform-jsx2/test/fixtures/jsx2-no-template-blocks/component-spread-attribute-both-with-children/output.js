var _createElement = require("jsx2").createElement;
function test() {
  return _createElement("div", null, _createElement(Component, {
    before: true,
    ...s,
    after: true
  }, "text"));
}
