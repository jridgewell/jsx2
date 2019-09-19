function test() {
  const ref = {};
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [ref]);
}

function _template(createElement, expressionMarker, Fragment) {
  const tree = createElement("div", "", expressionMarker, null);

  _template = () => tree;

  return tree;
}
