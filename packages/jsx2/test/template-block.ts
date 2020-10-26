type TemplateBlock = import('../src/template-block').TemplateBlock;

import { templateBlock } from '../src/jsx2';

describe('templateBlock', () => {
  function div(): TemplateBlock {
    return templateBlock`{"type": "div"}`;
  }

  function interpolations(): TemplateBlock {
    return templateBlock`{
      "type": ${'type'},
      "key": ${'key'},
      "ref": ${'ref'}
    }`;
  }

  it("parses JSON into template result's tree", () => {
    const result = div();

    expect(result.tree).toEqual({ type: 'div' });
  });

  it("sets results's constructor to undefined", () => {
    const result = div();

    expect(result).toHaveProperty('constructor', undefined);
    expect(result.constructor).toBe(undefined);
  });

  it('resuses same tree for multiple results', () => {
    const result = div();

    expect(result.tree).toBe(div().tree);
  });

  it('returns new result for every evaluation', () => {
    const result = div();

    expect(result).not.toBe(div());
  });

  it('inserts number for each interpolation', () => {
    const result = interpolations();

    expect(result.tree).toEqual({
      type: 0,
      key: 1,
      ref: 2,
    });
  });

  it('stores expressions in expression array', () => {
    const result = interpolations();

    expect(result.expressions).toEqual(['type', 'key', 'ref']);
  });

  it('excludes overridden properties', () => {
    const result = templateBlock`{"type":${'a'},"type":${'b'}}`;

    expect(result.tree).toEqual({ type: 1 });
    expect(result.expressions).toEqual(['a', 'b']);
  });

  it('sanity-check: naive JSON.parse cannot set constructor to undefined', () => {
    expect(() => {
      JSON.parse(`{"constructor": undefined}`);
    }).toThrow();

    const parsed = JSON.parse(`{"__proto__": null}`);
    expect(parsed.constructor).not.toBe(undefined);
  });
});
