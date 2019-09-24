function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [id, jsx2.Fragment]);
}

function _template(createElement) {
  const tree = createElement("div", {
    id: 0
  }, [createElement(1, null), createElement(1, null), createElement(1, null)]);

  _template = () => tree;

  return tree;
}
