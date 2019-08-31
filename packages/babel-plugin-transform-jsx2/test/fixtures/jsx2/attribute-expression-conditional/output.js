function test() {
  return jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), [cond ? true : false]);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement("div", "", null, {
    attr: expression
  });

  _template = () => tree;

  return tree;
}
