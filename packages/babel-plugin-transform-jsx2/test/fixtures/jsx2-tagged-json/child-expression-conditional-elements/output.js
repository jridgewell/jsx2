var _taggedTemplateBlock = require("jsx2").taggedTemplateBlock;
function test() {
  return _taggedTemplateBlock`{"type":"div","key":"","ref":null,"props":{"children":${cond ? _taggedTemplateBlock`{"type":"t","key":"","ref":null,"props":null}` : _taggedTemplateBlock`{"type":"f","key":"","ref":null,"props":null}`}}}`;
}
