function test() {
  return jsx2.templateResult(_template(jsx2.createElement), [first_children, second_key, third_ref, fourth_static_child]);
}

function _template(createElement) {
  const tree = createElement("div", {
    children: 0,
    key: 1,
    ref: 2
  }, 3);

  _template = () => tree;

  return tree;
}
