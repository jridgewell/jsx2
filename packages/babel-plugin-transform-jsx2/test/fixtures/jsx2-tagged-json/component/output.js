var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult`{"type":"div","key":"","ref":null,"props":{"children":[{"type":"before","key":"","ref":null,"props":{"children":${before}}},${_createElement(Component, {
    id: foo,
    bar: bar
  }, _templateResult`{"type":"first","key":"","ref":null,"props":{"children":${text}}}`, "second", _templateResult`{"type":"third","key":"","ref":null,"props":{"third":"third"}}`, fourth, _templateResult`{"type":"fifth","key":"","ref":null,"props":{"fifth":${fifth}}}`, [...sixth])},{"type":"after","key":"","ref":null,"props":{"children":${after}}}]}}`;
}
