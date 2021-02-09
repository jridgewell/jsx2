function test() {
  return <div>
    <Component id={foo} bar={bar}>
      {true && <div />}
    </Component>
  </div>;
}
