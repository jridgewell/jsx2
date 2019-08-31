function test() {
  return jsx2.createElement(Component, "", null, {
    id: foo,
    bar: bar,
    children: [jsx2.template(_template(jsx2.createElement, jsx2.expression, jsx2.Fragment), [text])]
  });
}

function Component(props) {
  return jsx2.template(_template2(jsx2.createElement, jsx2.expression, jsx2.Fragment), [props.id, props.bar, props.children]);
}

function _template(createElement, expression, Fragment) {
  const tree = createElement(Fragment, "", null, {
    children: [createElement("span", "", null, {
      children: [expression]
    })]
  });

  _template = () => tree;

  return tree;
}

function _template2(createElement, expression, Fragment) {
  const tree = createElement("foo", "", null, {
    id: expression,
    bar: expression,
    children: [createElement("span", "", null, {
      children: ["before"]
    }), expression, createElement("span", "", null, {
      children: ["after"]
    })]
  });

  _template2 = () => tree;

  return tree;
}
