function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0, jsx2.Fragment), [x], 0);
}

function _template(createElement, expressionMarker, Fragment) {
  const tree = createElement(Fragment, null, [expressionMarker]);

  _template = () => tree;

  return tree;
}
