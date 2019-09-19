function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker), [cond && jsx2.templateResult(_template2(jsx2.createElement, jsx2.expressionMarker), [x])]);
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
