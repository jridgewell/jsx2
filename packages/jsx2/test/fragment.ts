import { Fragment } from '../src/jsx2';

describe('Fragment', () => {
  it('returns the children of props', () => {
    const children: unknown = [];
    const ret = Fragment({ children });

    expect(ret).toBe(children);
  });

  it('returns undefined if no children', () => {
    const ret = Fragment({});

    expect(ret).toBe(undefined);
  });
});
