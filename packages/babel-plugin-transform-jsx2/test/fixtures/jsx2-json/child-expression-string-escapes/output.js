var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult(_template(), []);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":["a\`'\\"b\${c}d\\nf","a\`'\\"b\${c}d\\nf","a\`'\\"b\${c}d\\nf"]}}`);

  _template = () => tree;

  return tree;
}
