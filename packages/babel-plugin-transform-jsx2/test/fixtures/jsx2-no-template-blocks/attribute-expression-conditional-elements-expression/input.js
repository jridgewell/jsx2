function test() {
  return <div attr={cond && <inner>{x}</inner>}></div>;
}
