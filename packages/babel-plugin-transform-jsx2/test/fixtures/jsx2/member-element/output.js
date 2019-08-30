function test() {
  return {
    tree: _template(jsx2),
    expressions: [xml.foo],
    constructor: void 0
  };
}

function _template(jsx2) {
  const tree = {
    type: jsx2.expression,
    key: null,
    ref: null,
    props: null
  };

  _template = () => tree;

  return tree;
}
