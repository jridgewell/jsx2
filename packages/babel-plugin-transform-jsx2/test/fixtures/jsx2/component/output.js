function test() {
  return jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), [before, jsx2.createElement(Component, null, null, {
    id: foo,
    bar: bar,
    children: [jsx2.template(_template2(jsx2.createElement, jsx2.expression, jsx2.Fragment), [text])]
  }), after]);
}

function Component(props) {
  return jsx2.template(_template3(jsx2.createElement, jsx2.expression, jsx2.Fragment), [props.id, props.bar, props.children]);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement("div", null, null, {
    children: [createElement("span", null, null, {
      children: [expression]
    }), expression, createElement("span", null, null, {
      children: [expression]
    })]
  });

  _template = () => tree;

  return tree;
}

function _template2(createElement, expression, Fragment) {
  const tree = createElement(Fragment, null, null, {
    children: [createElement("span", null, null, {
      children: [expression]
    })]
  });

  _template2 = () => tree;

  return tree;
}

function _template3(createElement, expression, Fragment) {
  const tree = createElement("foo", null, null, {
    id: expression,
    bar: expression,
    children: [createElement("span", null, null, {
      children: ["before"]
    }), expression, createElement("span", null, null, {
      children: ["after"]
    })]
  });

  _template3 = () => tree;

  return tree;
}
