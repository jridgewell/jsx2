function test() {
  const ref = {};
  return jsx2.templateResult(_template(jsx2.createElement), [ref]);
}

function _template(createElement) {
  const tree = createElement("div", {
    ref: 0
  });

  _template = () => tree;

  return tree;
}
