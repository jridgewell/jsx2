function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0), [s], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", [expressionMarker, {
    after: true
  }]);

  _template = () => tree;

  return tree;
}
