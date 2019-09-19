function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [before, jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [jsx2.templateResult(_template2(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [text])]), after]);
}

function Component(props) {
  return jsx2.templateResult(_template3(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [props.id, props.bar, props.children]);
}

function _template(createElement, expressionMarker, Fragment) {
  const tree = createElement("div", null, [createElement("span", null, [expressionMarker]), expressionMarker, createElement("span", null, [expressionMarker])]);

  _template = () => tree;

  return tree;
}

function _template2(createElement, expressionMarker, Fragment) {
  const tree = createElement(Fragment, null, [createElement("span", null, [expressionMarker])]);

  _template2 = () => tree;

  return tree;
}

function _template3(createElement, expressionMarker, Fragment) {
  const tree = createElement("foo", {
    id: expressionMarker,
    bar: expressionMarker
  }, [createElement("span", null, ["before"]), expressionMarker, createElement("span", null, ["after"])]);

  _template3 = () => tree;

  return tree;
}
