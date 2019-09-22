function test() {
  return <div attr={cond ? <t /> : <f />}></div>;
}
