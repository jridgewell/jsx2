function test() {
  return jsx2.templateResult(_template(), [jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [true && jsx2.templateResult(_template2(), [])])], 1);
}

function _template() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":{"children":[1]}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":"div","key":"","ref":null,"props":null}`);

  _template2 = () => tree;

  return tree;
}
