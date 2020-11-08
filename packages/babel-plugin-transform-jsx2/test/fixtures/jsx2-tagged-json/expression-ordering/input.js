function test() {
  return <div children={first_children} ref={second_ref} key={third_key}>{fourth_static_child}</div>;
}

function test() {
  return <div children={1} ref={second_ref} key={third_key}>{fourth_static_child}</div>;
}

function test() {
  return <div children={first_children} ref={2} key={third_key}>{fourth_static_child}</div>;
}

function test() {
  return <div children={1} ref={2} key={third_key}>{fourth_static_child}</div>;
}
