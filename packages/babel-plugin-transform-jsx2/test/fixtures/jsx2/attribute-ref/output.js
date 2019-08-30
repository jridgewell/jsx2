function test() {
  const ref = {};
  return {
    tree: _template(jsx2),
    expressions: [ref],
    constructor: void 0
  };
}

function _template(jsx2) {
  const tree = {
    type: "div",
    key: null,
    ref: jsx2.expression,
    props: null
  };

  _template = () => tree;

  return tree;
}
