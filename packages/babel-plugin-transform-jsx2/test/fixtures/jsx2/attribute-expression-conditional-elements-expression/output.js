function test() {
  return jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), [cond && jsx2.template(_template2(jsx2.createElement, jsx2.expression, jsx2.Fragment), [x])]);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement("div", "", null, {
    attr: expression
  });

  _template = () => tree;

  return tree;
}

function _template2(createElement, expression, Fragment) {
  const tree = createElement("inner", "", null, {
    children: [expression]
  });

  _template2 = () => tree;

  return tree;
}
