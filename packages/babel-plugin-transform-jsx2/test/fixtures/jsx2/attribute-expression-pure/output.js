function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker), [[1]]);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", {
    attr: expressionMarker
  });

  _template = () => tree;

  return tree;
}
