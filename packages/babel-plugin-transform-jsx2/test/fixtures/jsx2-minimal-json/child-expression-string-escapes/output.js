function test() {
  return jsx2.templateResult(_template(), []);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","props":{"children":["a\`'\\"b\${c}d\\nf","a\`'\\"b\${c}d\\nf","a\`'\\"b\${c}d\\nf"]}}`);

  _template = () => tree;

  return tree;
}
