function test() {
  return jsx2.template(_template(jsx2), [before, jsx2.createElement(Component, null, null, {
    id: foo,
    bar: bar,
    children: [jsx2.template(_template2(jsx2), [text])]
  }), after]);
}

function Component(props) {
  return jsx2.template(_template3(jsx2), [props.id, props.bar, props.children]);
}

function _template(jsx2) {
  const tree = jsx2.createElement("div", null, null, {
    children: [jsx2.createElement("span", null, null, {
      children: [jsx2.expression]
    }), jsx2.expression, jsx2.createElement("span", null, null, {
      children: [jsx2.expression]
    })]
  });

  _template = () => tree;

  return tree;
}

function _template2(jsx2) {
  const tree = jsx2.createElement(jsx2.Fragment, null, null, {
    children: [jsx2.createElement("span", null, null, {
      children: [jsx2.expression]
    })]
  });

  _template2 = () => tree;

  return tree;
}

function _template3(jsx2) {
  const tree = jsx2.createElement("foo", null, null, {
    id: jsx2.expression,
    bar: jsx2.expression,
    children: [jsx2.createElement("span", null, null, {
      children: ["before"]
    }), jsx2.expression, jsx2.createElement("span", null, null, {
      children: ["after"]
    })]
  });

  _template3 = () => tree;

  return tree;
}
