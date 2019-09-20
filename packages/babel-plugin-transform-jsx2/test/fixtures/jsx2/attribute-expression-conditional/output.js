function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0), [cond ? true : false], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", {
    attr: expressionMarker
  });

  _template = () => tree;

  return tree;
}
