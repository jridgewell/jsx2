var _createElement = require("jsx2").createElement;

var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock`{"type":"div","key":"","ref":null,"props":{"children":${_createElement(Component, null, _templateBlock`{"type":"inner","key":"","ref":null,"props":[{"foo":${foo}},${bar},{"children":${x}}]}`)}}}`;
}
