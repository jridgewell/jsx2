function test() {
  return jsx2.templateResult(_template(), [expression], 10);
}

function _template() {
  const tree = JSON.parse("{\"type\":\"div\",\"children\":[0,1,2,3,4,5,6,7,8,9,10]}");

  _template = () => tree;

  return tree;
}
