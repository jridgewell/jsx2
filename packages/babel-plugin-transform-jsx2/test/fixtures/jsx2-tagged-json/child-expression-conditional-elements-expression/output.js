var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult`{"type":"div","key":"","ref":null,"props":{"children":${cond && _templateResult`{"type":"inner","key":"","ref":null,"props":{"children":${x}}}`}}}`;
}
