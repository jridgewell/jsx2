function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [[1]]);
}

function _template(createElement, expressionMarker, Fragment) {
  const tree = createElement("div", "", null, {
    attr: expressionMarker
  });

  _template = () => tree;

  return tree;
}
