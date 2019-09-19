function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [jsx2.createElement(Component, "", null, {
    children: [jsx2.templateResult(_template2(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [foo, bar, x])]
  })]);
}

function _template(createElement, expressionMarker, Fragment) {
  const tree = createElement("div", "", null, {
    children: [expressionMarker]
  });

  _template = () => tree;

  return tree;
}

function _template2(createElement, expressionMarker, Fragment) {
  const tree = createElement(Fragment, "", null, {
    children: [createElement("inner", "", null, [{
      foo: expressionMarker
    }, expressionMarker, {
      children: [expressionMarker]
    }])]
  });

  _template2 = () => tree;

  return tree;
}
