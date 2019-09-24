function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [`foo${bar}`]);
}

function _template(createElement) {
  const tree = createElement("div", null, [`foo`, 0, `foo${3}`, `a${'b'}c${0xd}e${false}g${null}i`, `a${`bc`}d`, `a${`b${'c'}d`}e`]);

  _template = () => tree;

  return tree;
}
