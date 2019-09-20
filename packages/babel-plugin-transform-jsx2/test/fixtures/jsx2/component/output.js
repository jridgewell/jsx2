function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0), [before, jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [jsx2.templateResult(_template2(jsx2.createElement, 0), [text], 0), "second", jsx2.templateResult(_template3(jsx2.createElement), []), fourth, jsx2.templateResult(_template4(jsx2.createElement, 0), [fifth], 0), [...sixth]]), after], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", null, [createElement("before", null, [expressionMarker]), expressionMarker, createElement("after", null, [expressionMarker])]);

  _template = () => tree;

  return tree;
}

function _template2(createElement, expressionMarker) {
  const tree = createElement("first", null, [expressionMarker]);

  _template2 = () => tree;

  return tree;
}

function _template3(createElement) {
  const tree = createElement("third", {
    third: "third"
  });

  _template3 = () => tree;

  return tree;
}

function _template4(createElement, expressionMarker) {
  const tree = createElement("fifth", {
    fifth: expressionMarker
  });

  _template4 = () => tree;

  return tree;
}
