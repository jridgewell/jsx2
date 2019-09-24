function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [cond ? true : false]);
}

function _template(createElement) {
  const tree = createElement("div", {
    attr: 0
  });

  _template = () => tree;

  return tree;
}
