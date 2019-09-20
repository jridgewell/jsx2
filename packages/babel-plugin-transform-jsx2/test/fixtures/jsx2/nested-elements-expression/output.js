function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0), [x], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", null, [createElement("inner", null, [expressionMarker])]);

  _template = () => tree;

  return tree;
}
