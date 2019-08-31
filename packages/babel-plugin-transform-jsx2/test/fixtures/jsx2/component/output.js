function test() {
  return {
    tree: _template(jsx2),
    expressions: [before, {
      type: Component,
      key: null,
      ref: null,
      props: {
        id: foo,
        bar: bar,
        children: [{
          type: "span",
          key: null,
          ref: null,
          props: {
            children: [text]
          },
          constructor: void 0
        }]
      },
      constructor: void 0
    }, after],
    constructor: void 0
  };
}

function Component(props) {
  return {
    tree: _template2(jsx2),
    expressions: [props.id, props.bar, props.children],
    constructor: void 0
  };
}

function _template(jsx2) {
  const tree = {
    type: "div",
    key: null,
    ref: null,
    props: {
      children: [{
        type: "span",
        key: null,
        ref: null,
        props: {
          children: [jsx2.expression]
        },
        constructor: void 0
      }, jsx2.expression, {
        type: "span",
        key: null,
        ref: null,
        props: {
          children: [jsx2.expression]
        },
        constructor: void 0
      }]
    },
    constructor: void 0
  };

  _template = () => tree;

  return tree;
}

function _template2(jsx2) {
  const tree = {
    type: "foo",
    key: null,
    ref: null,
    props: {
      id: jsx2.expression,
      bar: jsx2.expression,
      children: [{
        type: "span",
        key: null,
        ref: null,
        props: {
          children: ["before"]
        },
        constructor: void 0
      }, jsx2.expression, {
        type: "span",
        key: null,
        ref: null,
        props: {
          children: ["after"]
        },
        constructor: void 0
      }]
    },
    constructor: void 0
  };

  _template2 = () => tree;

  return tree;
}
