var _templateBlock = require("jsx2").templateBlock;

function test() {
  return _templateBlock`{"type":"div","key":"","ref":null,"props":{"children":["foo",${`foo${bar}`},"foo3","abc13efalsegnulli","abcd","abcde"]}}`;
}
