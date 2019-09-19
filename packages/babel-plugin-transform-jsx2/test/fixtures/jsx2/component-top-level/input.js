function test() {
  return <Component id={foo} bar={bar}>
    <first>{text}</first>
    second
    <third third="third"/>
    {fourth}
    <fifth fifth={fifth}/>
    {...sixth}
  </Component>;
}
