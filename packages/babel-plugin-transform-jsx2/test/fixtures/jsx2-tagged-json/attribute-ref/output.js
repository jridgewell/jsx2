var _templateResult = require("jsx2").templateResult;

function test() {
  const ref = {};
  return _templateResult`{"type":"div","key":"","ref":${ref},"props":null}`;
}
