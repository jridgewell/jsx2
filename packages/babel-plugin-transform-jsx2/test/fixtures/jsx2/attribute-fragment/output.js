function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [jsx2.templateResult(_template2(jsx2.createElement), [jsx2.Fragment])]);
}

function _template(createElement) {
  const tree = createElement("div", {
    attr: 0
  });

  _template = () => tree;

  return tree;
}

function _template2(createElement) {
  const tree = createElement(0, null);

  _template2 = () => tree;

  return tree;
}
