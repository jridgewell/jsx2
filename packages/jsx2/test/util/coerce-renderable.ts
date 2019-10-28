import { coerceRenderable } from '../../src/util/coerce-renderable';
import { createElement } from '../../src/create-element';

describe('coerceRenderable', () => {
  it('coerces null to null', () => {
    expect(coerceRenderable(null)).toBe(null);
  });

  it('coerces undefined to null', () => {
    expect(coerceRenderable(undefined)).toBe(null);
  });

  describe('booleans', () => {
    it('coerces true to null', () => {
      expect(coerceRenderable(true)).toBe(null);
    });

    it('coerces false to null', () => {
      expect(coerceRenderable(false)).toBe(null);
    });
  });

  describe('numbers', () => {
    it('coerces number to string', () => {
      expect(coerceRenderable(100)).toBe('100');
    });

    it('coerces 0 to string', () => {
      expect(coerceRenderable(0)).toBe('0');
    });
  });

  describe('strings', () => {
    it('coerces string to itself', () => {
      expect(coerceRenderable('test')).toBe('test');
    });

    it('coerces empty string to itself', () => {
      expect(coerceRenderable('')).toBe('');
    });
  });

  describe('arrays', () => {
    it('coerces array to itself', () => {
      const array = [0];
      expect(coerceRenderable(array)).toBe(array);
    });

    it('coerces empty array to itself', () => {
      const array: number[] = [];
      expect(coerceRenderable(array)).toBe(array);
    });
  });

  describe('vnodes', () => {
    it('coerces vndoe to itself', () => {
      const el = createElement('div');
      expect(coerceRenderable(el)).toBe(el);
    });
  });

  describe('others', () => {
    it('coerces symbol to null', () => {
      const sym = Symbol();
      expect(coerceRenderable(sym as any)).toBe(null);
    });

    it('coerces objects to null', () => {
      const obj = {};
      expect(coerceRenderable(obj as any)).toBe(null);
    });
  });
});
