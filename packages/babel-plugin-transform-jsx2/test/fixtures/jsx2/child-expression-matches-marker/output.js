function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 10), [expression], 10);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", null, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, expressionMarker]);

  _template = () => tree;

  return tree;
}
