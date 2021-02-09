function test() {
  return <div>{cond && <inner>{x}</inner>}</div>;
}
