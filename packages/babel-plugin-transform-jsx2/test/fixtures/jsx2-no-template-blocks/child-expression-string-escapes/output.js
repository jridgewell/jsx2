var _createElement = require("jsx2").createElement;
function test() {
  return _createElement("div", null, `a\`'"b\${c}d\nf`, 'a`\'"b${c}d\nf', "a`'\"b${c}d\nf");
}
