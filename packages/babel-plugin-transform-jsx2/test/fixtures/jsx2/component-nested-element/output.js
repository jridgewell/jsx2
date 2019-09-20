function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0), [jsx2.createElement(Component, null, [jsx2.templateResult(_template2(jsx2.createElement, 0), [foo, bar, x], 0)])], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", null, [expressionMarker]);

  _template = () => tree;

  return tree;
}

function _template2(createElement, expressionMarker) {
  const tree = createElement("inner", [{
    foo: expressionMarker
  }, expressionMarker], [expressionMarker]);

  _template2 = () => tree;

  return tree;
}
