import { shallowArrayEquals } from '../../src/util/shallow-array-equals';

describe('shallowArrayEquals', () => {
  it('compares arrays item-wise', () => {
    expect(shallowArrayEquals([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('compares items with strict equality', () => {
    expect(shallowArrayEquals([true], [1])).toBe(false);
  });

  it('returns true for the same array', () => {
    const array = [1, 2];
    expect(shallowArrayEquals(array, array)).toBe(true);
  });

  it('compares objects by identity', () => {
    expect(shallowArrayEquals([{ key: true }], [{ key: true }])).toBe(false);
  });

  it('returns false for un-equal array lengths', () => {
    expect(shallowArrayEquals([1, 2, 3], [1, 2, 3, 4])).toBe(false);
  });

  it('returns false undefined -> undefined', () => {
    expect(shallowArrayEquals(undefined, undefined)).toBe(false);
  });

  it('returns false undefined -> null', () => {
    expect(shallowArrayEquals(undefined, null)).toBe(false);
  });

  it('returns false null -> undefined', () => {
    expect(shallowArrayEquals(null, undefined)).toBe(false);
  });

  it('returns false null -> null', () => {
    expect(shallowArrayEquals(null, null)).toBe(false);
  });
});
