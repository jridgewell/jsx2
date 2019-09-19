function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker), [cond ? t : f]);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", null, [expressionMarker]);

  _template = () => tree;

  return tree;
}
