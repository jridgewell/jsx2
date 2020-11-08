function test() {
  return <div children={first_children} ref={second_ref} key={third_key}>{fourth_static_child}</div>;
}

function test() {
  return <div children={1n} ref={second_ref} key={third_key}>{fourth_static_child}</div>;
}

function test() {
  return <div children={first_children} ref={2n} key={third_key}>{fourth_static_child}</div>;
}

function test() {
  return <div children={1n} ref={2n} key={third_key}>{fourth_static_child}</div>;
}
