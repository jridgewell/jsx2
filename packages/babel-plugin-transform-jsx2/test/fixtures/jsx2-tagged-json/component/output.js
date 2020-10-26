var _createElement = require("jsx2").createElement;

var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock`{"type":"div","key":"","ref":null,"props":{"children":[{"type":"before","key":"","ref":null,"props":{"children":${before}}},${_createElement(Component, {
    id: foo,
    bar: bar
  }, _templateBlock`{"type":"first","key":"","ref":null,"props":{"children":${text}}}`, "second", _templateBlock`{"type":"third","key":"","ref":null,"props":{"third":"third"}}`, fourth, _templateBlock`{"type":"fifth","key":"","ref":null,"props":{"fifth":${fifth}}}`, [...sixth])},{"type":"after","key":"","ref":null,"props":{"children":${after}}}]}}`;
}
