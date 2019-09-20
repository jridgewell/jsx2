function test() {
  return jsx2.createElement(Component, {
    attr: jsx2.templateResult(_template(jsx2.createElement, 0), [x], 0)
  });
}

function _template(createElement, expressionMarker) {
  const tree = createElement("inner", null, [expressionMarker]);

  _template = () => tree;

  return tree;
}
