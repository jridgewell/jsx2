var _createElement = require("jsx2").createElement;
var _taggedTemplateBlock = require("jsx2").taggedTemplateBlock;
function test() {
  return _taggedTemplateBlock`{"type":"div","key":"","ref":null,"props":{"children":${_createElement(Component, null, _taggedTemplateBlock`{"type":"inner","key":"","ref":null,"props":[{"foo":${foo}},${bar},{"children":${x}}]}`)}}}`;
}
