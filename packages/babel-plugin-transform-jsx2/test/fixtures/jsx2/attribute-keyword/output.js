function test() {
  return {
    tree: _template(jsx2),
    expressions: [],
    constructor: void 0
  };
}

function _template(jsx2) {
  const tree = {
    type: "div",
    key: null,
    ref: null,
    props: {
      class: "foo"
    },
    constructor: void 0
  };

  _template = () => tree;

  return tree;
}