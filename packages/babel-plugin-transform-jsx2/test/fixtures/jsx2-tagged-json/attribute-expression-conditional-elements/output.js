var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult`{"type":"div","key":"","ref":null,"props":{"attr":${cond ? _templateResult`{"type":"t","key":"","ref":null,"props":null}` : _templateResult`{"type":"f","key":"","ref":null,"props":null}`}}}`;
}
