function test() {
  return jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [jsx2.templateResult(_template(), [text], 1), "second", jsx2.templateResult(_template2(), []), fourth, jsx2.templateResult(_template3(), [fifth], 1), [...sixth]]);
}

function _template() {
  const tree = JSON.parse(`{"type":"first","key":"","ref":null,"props":{"children":[1]}}`);

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse(`{"type":"third","key":"","ref":null,"props":{"third":"third"}}`);

  _template2 = () => tree;

  return tree;
}

function _template3() {
  const tree = JSON.parse(`{"type":"fifth","key":"","ref":null,"props":{"fifth":1}}`);

  _template3 = () => tree;

  return tree;
}
