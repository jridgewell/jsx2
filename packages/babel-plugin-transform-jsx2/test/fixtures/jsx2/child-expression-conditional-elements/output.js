function test() {
  return jsx2.template(_template(jsx2), [cond ? jsx2.template(_template2(jsx2), []) : jsx2.template(_template3(jsx2), [])]);
}

function _template(jsx2) {
  const tree = jsx2.createElement("div", null, null, {
    children: [jsx2.expression]
  });

  _template = () => tree;

  return tree;
}

function _template2(jsx2) {
  const tree = jsx2.createElement("t", null, null, null);

  _template2 = () => tree;

  return tree;
}

function _template3(jsx2) {
  const tree = jsx2.createElement("f", null, null, null);

  _template3 = () => tree;

  return tree;
}
