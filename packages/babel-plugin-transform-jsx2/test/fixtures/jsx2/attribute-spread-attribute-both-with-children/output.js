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
      after: true,
      children: ["text"]
    }],
    constructor: void 0
  };

  _template = () => tree;

  return tree;
}
