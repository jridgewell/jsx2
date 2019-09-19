function test() {
  const ref = {};
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker), [ref]);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", {
    ref: expressionMarker
  });

  _template = () => tree;

  return tree;
}
