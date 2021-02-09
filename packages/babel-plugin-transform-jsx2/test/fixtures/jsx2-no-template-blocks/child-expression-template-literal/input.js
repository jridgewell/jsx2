function test() {
  return <div>
    {`foo`}
    {`foo${bar}`}
    {`foo${3}`}
    {`a${'b'}c${0xd}e${false}g${null}i`}
    {`a${`bc`}d`}
    {`a${`b${'c'}d`}e`}
  </div>;
}
