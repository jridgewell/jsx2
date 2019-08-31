function test() {
  const ref = {};
  return {
    tree: _template(jsx2),
    expressions: [{
      type: Component,
      key: null,
      ref: ref,
      props: null,
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
