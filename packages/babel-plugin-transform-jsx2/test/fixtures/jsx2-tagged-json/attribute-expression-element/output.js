var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock`{"type":"div","key":"","ref":null,"props":{"attr":${_templateBlock`{"type":"inner","key":"","ref":null,"props":null}`}}}`;
}
