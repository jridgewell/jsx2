var _templateResult = require("jsx2").templateResult;

function test() {
  return _templateResult`{"type":"div","key":"","ref":null,"props":{"children":["foo",${`foo${bar}`},"foo3","abc13efalsegnulli","abcd","abcde"]}}`;
}
