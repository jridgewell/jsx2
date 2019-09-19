function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker), [cond ? jsx2.templateResult(_template2(jsx2.createElement), []) : jsx2.templateResult(_template3(jsx2.createElement), [])]);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", null, [expressionMarker]);

  _template = () => tree;

  return tree;
}

function _template2(createElement) {
  const tree = createElement("t");

  _template2 = () => tree;

  return tree;
}

function _template3(createElement) {
  const tree = createElement("f");

  _template3 = () => tree;

  return tree;
}
