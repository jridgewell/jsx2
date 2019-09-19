function test() {
  return jsx2.templateResult(_template(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [before, jsx2.createElement(Component, "", null, {
    id: foo,
    bar: bar,
    children: [jsx2.templateResult(_template2(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [text])]
  }), after]);
}

function Component(props) {
  return jsx2.templateResult(_template3(jsx2.createElement, jsx2.expressionMarker, jsx2.Fragment), [props.id, props.bar, props.children]);
}

function _template(createElement, expressionMarker, Fragment) {
  const tree = createElement("div", "", null, {
    children: [createElement("span", "", null, {
      children: [expressionMarker]
    }), expressionMarker, createElement("span", "", null, {
      children: [expressionMarker]
    })]
  });

  _template = () => tree;

  return tree;
}

function _template2(createElement, expressionMarker, Fragment) {
  const tree = createElement(Fragment, "", null, {
    children: [createElement("span", "", null, {
      children: [expressionMarker]
    })]
  });

  _template2 = () => tree;

  return tree;
}

function _template3(createElement, expressionMarker, Fragment) {
  const tree = createElement("foo", "", null, {
    id: expressionMarker,
    bar: expressionMarker,
    children: [createElement("span", "", null, {
      children: ["before"]
    }), expressionMarker, createElement("span", "", null, {
      children: ["after"]
    })]
  });

  _template3 = () => tree;

  return tree;
}
