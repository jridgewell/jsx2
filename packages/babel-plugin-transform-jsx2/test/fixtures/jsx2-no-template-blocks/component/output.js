var _createElement = require("jsx2").createElement;
function test() {
  return _createElement("div", null, _createElement("before", null, before), _createElement(Component, {
    id: foo,
    bar: bar
  }, _createElement("first", null, text), "second", _createElement("third", {
    third: "third"
  }), fourth, _createElement("fifth", {
    fifth: fifth
  }), [...sixth]), _createElement("after", null, after));
}
