import { cloneElement, createElement } from '../src/jsx2';

describe('cloneElement', () => {
  it('inherits type from vnode', () => {
    const el = createElement(() => {});

    const cloned = cloneElement(el);

    expect(cloned.type).toBe(el.type);
  });

  it('creates a new copy of props', () => {
    const el = createElement(() => {}, { test: true });

    const cloned = cloneElement(el);

    expect(cloned.props).not.toBe(el.props);
    expect(cloned.props).toEqual(el.props);
  });

  describe('key', () => {
    it('inherits key from vnode', () => {
      const el = createElement(() => {}, { key: 'test' });

      const cloned = cloneElement(el);

      expect(cloned.key).toBe(el.key);
    });

    it('overwrites key from new props', () => {
      const el = createElement(() => {}, { key: 'test' });

      const cloned = cloneElement(el, { key: 'overwrite' });

      expect(cloned.key).toBe('overwrite');
    });

    it('inherits key with undefined', () => {
      const el = createElement(() => {}, { key: 'test' });

      const cloned = cloneElement(el, { key: undefined });

      expect(cloned.key).toBe(el.key);
    });

    it('overwrites key with null', () => {
      const el = createElement(() => {}, { key: 'test' });

      const cloned = cloneElement(el, { key: null });

      expect(cloned.key).toBe(null);
    });
  });

  describe('ref', () => {
    it('inherits ref from vnode', () => {
      const el = createElement(() => {}, { ref: () => {} });

      const cloned = cloneElement(el);

      expect(cloned.ref).toBe(el.ref);
    });

    it('overwrites ref from new props', () => {
      const el = createElement(() => {}, { ref: () => {} });
      const ref = () => {};

      const cloned = cloneElement(el, { ref });

      expect(cloned.ref).toBe(ref);
    });

    it('inherits ref with undefined', () => {
      const el = createElement(() => {}, { ref: () => {} });

      const cloned = cloneElement(el, { ref: undefined });

      expect(cloned.ref).toBe(el.ref);
    });

    it('overwrites ref with null', () => {
      const el = createElement(() => {}, { ref: () => {} });

      const cloned = cloneElement(el, { ref: null });

      expect(cloned.ref).toBe(null);
    });
  });

  describe('children', () => {
    it('inherits children from vnode', () => {
      const el = createElement(() => {}, { children: [0] });

      const cloned = cloneElement(el);

      expect(cloned.props.children).toBe(el.props.children);
    });

    it('overwrites children from new props', () => {
      const el = createElement(() => {}, { children: [0] });
      const children = [1];

      const cloned = cloneElement(el, { children });

      expect(cloned.props.children).toBe(children);
    });

    it('overwrites children with undefined', () => {
      const el = createElement(() => {}, { children: [0] });

      const cloned = cloneElement(el, { children: undefined });

      expect(cloned.props.children).toBe(undefined);
    });

    it('overwrites children with null', () => {
      const el = createElement(() => {}, { children: [0] });

      const cloned = cloneElement(el, { children: null });

      expect(cloned.props.children).toBe(null);
    });

    it('overwrites children with var_args', () => {
      const el = createElement(() => {}, { children: [0] });

      const cloned = cloneElement(el, null, 'overwrite');

      expect(cloned.props.children).toBe('overwrite');
    });

    it('overwrites children with multiple var_args', () => {
      const el = createElement(() => {}, { children: [0] });

      const cloned = cloneElement(el, null, 'first', 'second');

      expect(cloned.props.children).toEqual(['first', 'second']);
    });

    it('prefers var_args over children prop', () => {
      const el = createElement(() => {}, { children: [0] });

      const cloned = cloneElement(el, { children: 'prop' }, 'test');

      expect(cloned.props.children).toBe('test');
    });
  });
});
