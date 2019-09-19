function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker), [jsx2.createElement(Component, { ...s
  })]);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", null, [expressionMarker]);

  _template = () => tree;

  return tree;
}
