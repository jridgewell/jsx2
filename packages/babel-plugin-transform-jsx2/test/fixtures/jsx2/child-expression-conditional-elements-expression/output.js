function test() {
  return {
    tree: _template(jsx2),
    expressions: [cond && {
      tree: _template2(jsx2),
      expressions: [x],
      constructor: void 0
    }],
    constructor: void 0
  };
}

function _template(jsx2) {
  const tree = {
    type: "div",
    key: null,
    ref: null,
    props: {
      children: [jsx2.expression]
    }
  };

  _template = () => tree;

  return tree;
}

function _template2(jsx2) {
  const tree = {
    type: "inner",
    key: null,
    ref: null,
    props: {
      children: [jsx2.expression]
    }
  };

  _template2 = () => tree;

  return tree;
}
