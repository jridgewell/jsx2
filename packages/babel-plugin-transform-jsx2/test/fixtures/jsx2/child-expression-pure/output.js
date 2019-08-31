function test() {
  return {
    tree: _template(jsx2),
    expressions: [[1]],
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
