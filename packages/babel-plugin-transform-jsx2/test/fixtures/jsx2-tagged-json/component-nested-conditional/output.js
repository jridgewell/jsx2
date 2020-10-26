var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult`{"type":"div","key":"","ref":null,"props":{"children":${_createElement(Component, {
    id: foo,
    bar: bar
  }, true && _templateResult`{"type":"div","key":"","ref":null,"props":null}`)}}}`;
}
