function test() {
  return jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [jsx2.templateResult`{"type":"first","key":"","ref":null,"props":{"children":${text}}}`, "second", jsx2.templateResult`{"type":"third","key":"","ref":null,"props":{"third":"third"}}`, fourth, jsx2.templateResult`{"type":"fifth","key":"","ref":null,"props":{"fifth":${fifth}}}`, [...sixth]]);
}
