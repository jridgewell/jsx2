function test() {
  return jsx2.templateResult(_template(), [before, jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [jsx2.templateResult(_template2(), [text], 0), "second", jsx2.templateResult(_template3(), []), fourth, jsx2.templateResult(_template4(), [fifth], 0), [...sixth]]), after], 0);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"div\",\"children\":[{\"type\":\"before\",\"children\":[0]},0,{\"type\":\"after\",\"children\":[0]}]}");

  _template = () => tree;

  return tree;
}

function _template2() {
  const tree = JSON.parse("{\"type\":\"first\",\"children\":[0]}");

  _template2 = () => tree;

  return tree;
}

function _template3() {
  const tree = JSON.parse("{\"type\":\"third\",\"props\":{\"third\":\"third\"}}");

  _template3 = () => tree;

  return tree;
}

function _template4() {
  const tree = JSON.parse("{\"type\":\"fifth\",\"props\":{\"fifth\":0}}");

  _template4 = () => tree;

  return tree;
}
