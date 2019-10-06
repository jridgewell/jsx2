function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [cond && jsx2.templateResult(_template2(jsx2.createElement), [x])]);
}

function _template(createElement) {
  const tree = createElement("div", null, 0);

  _template = () => tree;

  return tree;
}

function _template2(createElement) {
  const tree = createElement("inner", null, 0);

  _template2 = () => tree;

  return tree;
}
