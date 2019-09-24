function test() {
  return jsx2.templateResult(_template(jsx2.createElement), []);
}

function _template(createElement) {
  const tree = createElement("div", null, [`a\`'"b\${c}d\nf`, 'a`\'"b${c}d\nf', "a`'\"b${c}d\nf"]);

  _template = () => tree;

  return tree;
}
