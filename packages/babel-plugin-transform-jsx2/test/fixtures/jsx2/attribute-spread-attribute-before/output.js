function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0), [s], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", [{
    before: true
  }, expressionMarker]);

  _template = () => tree;

  return tree;
}
