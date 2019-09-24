function test() {
  return <div>
    {`a\`'"b\${c}d\nf`}
    {'a`\'"b${c}d\nf'}
    {"a`'\"b${c}d\nf"}
  </div>;
}
