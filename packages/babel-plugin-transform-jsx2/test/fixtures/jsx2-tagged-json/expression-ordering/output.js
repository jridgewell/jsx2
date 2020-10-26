var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult`{"type":"div","key":${second_key},"ref":${third_ref},"props":{"children":${first_children},"children":${fourth_static_child}}}`;
}
