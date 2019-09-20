function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0), [cond && jsx2.templateResult(_template2(jsx2.createElement, 0), [x], 0)], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", {
    attr: expressionMarker
  });

  _template = () => tree;

  return tree;
}

function _template2(createElement, expressionMarker) {
  const tree = createElement("inner", null, [expressionMarker]);

  _template2 = () => tree;

  return tree;
}
