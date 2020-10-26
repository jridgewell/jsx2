var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock`{"type":"div","key":${second_key},"ref":${third_ref},"props":{"children":${first_children},"children":${fourth_static_child}}}`;
}
