var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock`{"type":"div","key":"","ref":null,"props":{"children":${cond ? _templateBlock`{"type":"t","key":"","ref":null,"props":null}` : _templateBlock`{"type":"f","key":"","ref":null,"props":null}`}}}`;
}
