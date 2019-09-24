function test() {
  return jsx2.templateResult`{"type":"div","key":"","ref":null,"props":{"children":[${jsx2.createElement(Component, {
    id: foo,
    bar: bar
  }, [true && jsx2.templateResult`{"type":"div","key":"","ref":null,"props":null}`])}]}}`;
}
