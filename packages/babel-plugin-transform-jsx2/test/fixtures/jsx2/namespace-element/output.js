function test() {
  return {
    tree: _template(jsx2),
    expressions: [],
    constructor: void 0
  };
}

function _template(jsx2) {
  const tree = {
    type: "xml:foo",
    key: null,
    ref: null,
    props: null,
    constructor: void 0
  };

  _template = () => tree;

  return tree;
}
