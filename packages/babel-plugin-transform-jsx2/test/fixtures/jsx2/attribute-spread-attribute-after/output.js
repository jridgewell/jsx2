function test() {
  return jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), [s]);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement("div", "", null, [expression, {
    after: true
  }]);

  _template = () => tree;

  return tree;
}
