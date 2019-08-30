function test() {
  return {
    tree: _template(jsx2),
    expressions: [s],
    constructor: void 0
  };
}

function _template(jsx2) {
  const tree = {
    type: "div",
    key: null,
    ref: null,
    props: [{
      before: true
    }, jsx2.expression, {
      after: true
    }]
  };

  _template = () => tree;

  return tree;
}
