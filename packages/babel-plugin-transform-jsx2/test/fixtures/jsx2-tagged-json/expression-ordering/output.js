var _templateBlock = require("jsx2").templateBlock;

function test() {
  var _first_children, _second_ref;

  return _templateBlock`{"type":"div","key":${(_first_children = first_children, _second_ref = second_ref, third_key)},"ref":${_second_ref},"props":{"children":${_first_children},"children":${fourth_static_child}}}`;
}

function test() {
  var _second_ref2;

  return _templateBlock`{"type":"div","key":${(_second_ref2 = second_ref, third_key)},"ref":${_second_ref2},"props":{"children":${1},"children":${fourth_static_child}}}`;
}

function test() {
  var _first_children2;

  return _templateBlock`{"type":"div","key":${(_first_children2 = first_children, third_key)},"ref":${2},"props":{"children":${_first_children2},"children":${fourth_static_child}}}`;
}

function test() {
  return _templateBlock`{"type":"div","key":${third_key},"ref":${2},"props":{"children":${1},"children":${fourth_static_child}}}`;
}
