function test() {
  return {
    tree: _template(jsx2),
    expressions: [x],
    constructor: void 0
  };
}

function _template(jsx2) {
  const tree = {
    type: jsx2.Fragment,
    key: null,
    ref: null,
    props: {
      children: [jsx2.expression]
    }
  };

  _template = () => tree;

  return tree;
}
