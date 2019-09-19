function test() {
  return jsx2.createElement(Component, {
    attr: jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [])
  });
}

function _template(createElement, expressionMarker, Fragment) {
  const tree = createElement("inner");

  _template = () => tree;

  return tree;
}
