function test() {
  return jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), [cond ? jsx2.template(_template2(jsx2.createElement, jsx2.expression, jsx2.Fragment), []) : jsx2.template(_template3(jsx2.createElement, jsx2.expression, jsx2.Fragment), [])]);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement("div", null, null, {
    attr: expression
  });

  _template = () => tree;

  return tree;
}

function _template2(createElement, expression, Fragment) {
  const tree = createElement("t", null, null, null);

  _template2 = () => tree;

  return tree;
}

function _template3(createElement, expression, Fragment) {
  const tree = createElement("f", null, null, null);

  _template3 = () => tree;

  return tree;
}
