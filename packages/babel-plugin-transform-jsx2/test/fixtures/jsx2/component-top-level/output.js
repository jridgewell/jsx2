function test() {
  return jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [jsx2.templateResult(_template(jsx2.createElement, 0), [text], 0), "second", jsx2.templateResult(_template2(jsx2.createElement), []), fourth, jsx2.templateResult(_template3(jsx2.createElement, 0), [fifth], 0), [...sixth]]);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("first", null, [expressionMarker]);

  _template = () => tree;

  return tree;
}

function _template2(createElement) {
  const tree = createElement("third", {
    third: "third"
  });

  _template2 = () => tree;

  return tree;
}

function _template3(createElement, expressionMarker) {
  const tree = createElement("fifth", {
    fifth: expressionMarker
  });

  _template3 = () => tree;

  return tree;
}
