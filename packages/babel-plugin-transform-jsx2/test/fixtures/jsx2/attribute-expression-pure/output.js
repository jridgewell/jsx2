function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0), [[1]], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", {
    attr: expressionMarker
  });

  _template = () => tree;

  return tree;
}
