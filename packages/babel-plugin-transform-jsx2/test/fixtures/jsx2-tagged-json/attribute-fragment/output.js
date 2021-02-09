var _Fragment = require("jsx2").Fragment;

var _taggedTemplateBlock = require("jsx2").taggedTemplateBlock;

function test() {
  return _taggedTemplateBlock`{"type":"div","key":"","ref":null,"props":{"attr":${_taggedTemplateBlock`{"type":${_Fragment},"key":"","ref":null,"props":null}`}}}`;
}
