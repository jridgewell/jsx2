var _createElement = require("jsx2").createElement;

var _templateBlock = require("jsx2").templateBlock;

function test() {
  const ref = {};
  return _templateBlock`{"type":"div","key":"","ref":null,"props":{"children":${_createElement(Component, {
    ref: ref
  })}}}`;
}
