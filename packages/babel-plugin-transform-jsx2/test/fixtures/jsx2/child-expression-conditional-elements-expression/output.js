var _ref = {
  type: "div",
  key: null,
  ref: null,
  props: {
    children: [jsx2.expression]
  }
};
var _ref2 = {
  type: "inner",
  key: null,
  ref: null,
  props: {
    children: [jsx2.expression]
  }
};

function test() {
  return {
    template: _ref,
    expressions: [cond && {
      template: _ref2,
      expressions: [x],
      constructor: void 0
    }],
    constructor: void 0
  };
}
