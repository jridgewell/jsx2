function test() {
  return jsx2.templateResult(_template(jsx2.createElement, 0), [jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [true && jsx2.templateResult(_template2(jsx2.createElement), [])])], 0);
}

function _template(createElement, expressionMarker) {
  const tree = createElement("div", null, [expressionMarker]);

  _template = () => tree;

  return tree;
}

function _template2(createElement) {
  const tree = createElement("div");

  _template2 = () => tree;

  return tree;
}
