function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [before, jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [jsx2.templateResult(_template2(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [text]), "second", jsx2.templateResult(_template3(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), []), fourth, jsx2.templateResult(_template4(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [fifth]), [...sixth]]), after]);
}

function _template(createElement, expressionMarker, Fragment) {
  const tree = createElement("div", null, [createElement("before", null, [expressionMarker]), expressionMarker, createElement("after", null, [expressionMarker])]);

  _template = () => tree;

  return tree;
}

function _template2(createElement, expressionMarker, Fragment) {
  const tree = createElement("first", null, [expressionMarker]);

  _template2 = () => tree;

  return tree;
}

function _template3(createElement, expressionMarker, Fragment) {
  const tree = createElement("third", {
    third: "third"
  });

  _template3 = () => tree;

  return tree;
}

function _template4(createElement, expressionMarker, Fragment) {
  const tree = createElement("fifth", {
    fifth: expressionMarker
  });

  _template4 = () => tree;

  return tree;
}
