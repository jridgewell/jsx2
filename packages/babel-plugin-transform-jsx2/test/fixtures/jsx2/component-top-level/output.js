function test() {
  return <Component id={foo} bar={bar}>
    <span>{text}</span>
  </Component>;
}

function Component(props) {
  return {
    tree: _template(jsx2),
    expressions: [props.id, props.bar, props.children],
    constructor: void 0
  };
}

function _template(jsx2) {
  const tree = {
    type: "foo",
    key: null,
    ref: null,
    props: {
      id: jsx2.expression,
      bar: jsx2.expression,
      children: [{
        type: "span",
        key: null,
        ref: null,
        props: {
          children: ["before"]
        }
      }, jsx2.expression, {
        type: "span",
        key: null,
        ref: null,
        props: {
          children: ["after"]
        }
      }]
    }
  };

  _template = () => tree;

  return tree;
}
