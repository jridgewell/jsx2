function test() {
  const ref = {};
  return jsx2.templateResult`{"type":"div","key":"","ref":null,"props":{"children":${jsx2.createElement(Component, {
    ref: ref
  })}}}`;
}
