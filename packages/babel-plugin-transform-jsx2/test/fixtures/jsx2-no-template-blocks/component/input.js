function test() {
  return <div>
    <before>{before}</before>
    <Component id={foo} bar={bar}>
      <first>{text}</first>
      second
      <third third="third"/>
      {fourth}
      <fifth fifth={fifth}/>
      {...sixth}
    </Component>
    <after>{after}</after>
  </div>;
}
