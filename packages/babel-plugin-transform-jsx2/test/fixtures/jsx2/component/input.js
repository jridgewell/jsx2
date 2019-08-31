function test() {
  return <div>
    <span>{before}</span>
    <Component id={foo} bar={bar}>
      <span>{text}</span>
    </Component>
    <span>{after}</span>
  </div>;
}

function Component(props) {
  return <foo id={props.id} bar={props.bar}>
    <span>before</span>
    {props.children}
    <span>after</span>
  </foo>;
}

