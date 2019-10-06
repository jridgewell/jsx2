function test() {
  return jsx2.templateResult`{"type":"div","key":"","ref":null,"props":{"children":${jsx2.createElement(Component, null, jsx2.templateResult`{"type":"inner","key":"","ref":null,"props":[{"foo":${foo}},${bar},{"children":${x}}]}`)}}}`;
}
