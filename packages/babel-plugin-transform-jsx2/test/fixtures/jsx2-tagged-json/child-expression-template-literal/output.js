var _taggedTemplateBlock = require("jsx2").taggedTemplateBlock;

function test() {
  return _taggedTemplateBlock`{"type":"div","key":"","ref":null,"props":{"children":["foo",${`foo${bar}`},"foo3","abc13efalsegnulli","abcd","abcde"]}}`;
}
