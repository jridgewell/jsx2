function jsx(type, props) {
  return {
    type,
    props,
    constructor: undefined,
  };
}

const a = jsx('a', null);
const b = jsx('a', {});
const c = jsx('a', [{}]);

%DebugPrint(a);
%DebugPrint(b);
%DebugPrint(c);
