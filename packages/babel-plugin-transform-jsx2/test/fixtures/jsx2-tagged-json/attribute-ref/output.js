var _templateBlock = require("jsx2").templateBlock;

function test() {
  const ref = {};
  return _templateBlock`{"type":"div","key":"","ref":${ref},"props":null}`;
}
