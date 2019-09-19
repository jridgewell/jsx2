function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [x]);
}

function _template(createElement, expressionMarker, Fragment) {
  const tree = createElement("div", "", null, {
    children: [createElement("inner", "", null, {
      children: [expressionMarker]
    })]
  });

  _template = () => tree;

  return tree;
}
