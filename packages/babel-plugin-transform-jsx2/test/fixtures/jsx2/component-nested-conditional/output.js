function test() {
  return jsx2.templateResult(_template(), [jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [true && jsx2.templateResult(_template2(), [])])], 0);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"div\",\"children\":[0]}");

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse("{\"type\":\"div\"}");

  _template2 = () => tree;

  return tree;
}
