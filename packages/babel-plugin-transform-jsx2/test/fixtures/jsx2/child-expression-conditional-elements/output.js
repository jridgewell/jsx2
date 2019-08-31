function test() {
  return {
    tree: _template(jsx2),
    expressions: [cond ? {
      tree: _template2(jsx2),
      expressions: [],
      constructor: void 0
    } : {
      tree: _template3(jsx2),
      expressions: [],
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
    },
    constructor: void 0
  };

  _template = () => tree;

  return tree;
}

function _template2(jsx2) {
  const tree = {
    type: "t",
    key: null,
    ref: null,
    props: null,
    constructor: void 0
  };

  _template2 = () => tree;

  return tree;
}

function _template3(jsx2) {
  const tree = {
    type: "f",
    key: null,
    ref: null,
    props: null,
    constructor: void 0
  };

  _template3 = () => tree;

  return tree;
}
