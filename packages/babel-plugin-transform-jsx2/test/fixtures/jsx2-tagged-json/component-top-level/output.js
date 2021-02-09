var _createElement = require("jsx2").createElement;

var _taggedTemplateBlock = require("jsx2").taggedTemplateBlock;

function test() {
  return _createElement(Component, {
    id: foo,
    bar: bar
  }, _taggedTemplateBlock`{"type":"first","key":"","ref":null,"props":{"children":${text}}}`, "second", _taggedTemplateBlock`{"type":"third","key":"","ref":null,"props":{"third":"third"}}`, fourth, _taggedTemplateBlock`{"type":"fifth","key":"","ref":null,"props":{"fifth":${fifth}}}`, [...sixth]);
}
