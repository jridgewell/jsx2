function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0), [cond ? t : f], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", null, [expressionMarker]);

  _template = () => tree;

  return tree;
}
