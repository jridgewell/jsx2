function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [s]);
}

function _template(createElement) {
  const tree = createElement("div", [0, {
    after: true
  }], ["text"]);

  _template = () => tree;

  return tree;
}
