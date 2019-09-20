function test() {
  const ref = {};
  return jsx2.templateResult(_template(jsx2.createElement, 0), [jsx2.createElement(Component, {
    ref: ref
  })], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", null, [expressionMarker]);

  _template = () => tree;

  return tree;
}
