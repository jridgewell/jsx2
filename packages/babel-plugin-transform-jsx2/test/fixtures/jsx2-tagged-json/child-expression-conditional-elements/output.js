function test() {
  return jsx2.templateResult`{"type":"div","key":"","ref":null,"props":{"children":${cond ? jsx2.templateResult`{"type":"t","key":"","ref":null,"props":null}` : jsx2.templateResult`{"type":"f","key":"","ref":null,"props":null}`}}}`;
}
