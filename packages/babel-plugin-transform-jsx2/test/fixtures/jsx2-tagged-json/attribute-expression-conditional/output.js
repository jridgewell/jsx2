function test() {
  return jsx2.templateResult`{"type":"div","key":"","ref":null,"props":{"attr":${cond ? true : false}}}`;
}
