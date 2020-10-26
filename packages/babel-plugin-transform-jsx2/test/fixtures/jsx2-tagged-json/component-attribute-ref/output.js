var _createElement = require("jsx2").createElement;

var _templateResult = require("jsx2").templateResult;

function test() {
  const ref = {};
  return _templateResult`{"type":"div","key":"","ref":null,"props":{"children":${_createElement(Component, {
    ref: ref
  })}}}`;
}
