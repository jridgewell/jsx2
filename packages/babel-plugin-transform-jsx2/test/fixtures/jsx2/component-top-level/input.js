function test() {
  return <Component id={foo} bar={bar}>
    <span>{text}</span>
  </Component>;
}

function Component(props) {
  return <foo id={props.id} bar={props.bar}>
    <span>before</span>
    {props.children}
    <span>after</span>
  </foo>;
}

