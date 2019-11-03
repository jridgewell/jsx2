import { fiber } from '../../src/fiber';
import { mark } from '../../src/fiber/mark';
import { createElement } from '../..';
import { insert } from '../../src/fiber/insert';
import { replace } from '../../src/fiber/replace';

describe('replace', () => {
  function makeElementFiber(tag: string) {
    const f = fiber(createElement(tag));
    f.dom = document.createElement(tag);
    return f;
  }

  describe('without next', () => {
    it('unmounts any refs', () => {
      const parent = fiber('parent');
      const previous = makeElementFiber('previous');
      const current = makeElementFiber('current');
      const old = makeElementFiber('old');
      const container = document.createElement('div');
      const ref = jest.fn();
      old.ref = ref;
      mark(previous, parent, null);
      mark(old, parent, previous);
      insert(parent, container, null);

      replace(old, current, container);

      expect(ref).toHaveBeenCalledTimes(1);
      expect(ref).toHaveBeenCalledWith(null);
    });

    it('mounts fiber inside container', () => {
      const parent = fiber('parent');
      const previous = makeElementFiber('previous');
      const current = makeElementFiber('current');
      const old = makeElementFiber('old');
      const container = document.createElement('div');
      mark(previous, parent, null);
      mark(old, parent, previous);
      insert(parent, container, null);

      replace(old, current, container);

      expect(Array.from(container.childNodes)).toEqual([previous.dom, current.dom]);
    });

    it("removes old fiber's dom", () => {
      const parent = fiber('parent');
      const previous = makeElementFiber('previous');
      const current = makeElementFiber('current');
      const old = makeElementFiber('old');
      const container = document.createElement('div');
      mark(previous, parent, null);
      mark(old, parent, previous);
      insert(parent, container, null);

      replace(old, current, container);

      expect(Array.from(container.childNodes)).not.toContain(old.dom);
    });
  });

  describe('with next dom', () => {
    it("sets fibers's next to next", () => {
      const parent = fiber('parent');
      const previous = makeElementFiber('previous');
      const current = makeElementFiber('current');
      const old = makeElementFiber('old');
      const next = makeElementFiber('next');
      const container = document.createElement('div');
      mark(previous, parent, null);
      mark(old, parent, previous);
      mark(next, parent, old);
      insert(parent, container, null);

      replace(old, current, container);

      expect(current.next).toBe(next);
    });

    it('unmounts any refs', () => {
      const parent = fiber('parent');
      const previous = makeElementFiber('previous');
      const current = makeElementFiber('current');
      const old = makeElementFiber('old');
      const next = makeElementFiber('next');
      const container = document.createElement('div');
      const ref = jest.fn();
      old.ref = ref;
      mark(previous, parent, null);
      mark(old, parent, previous);
      mark(next, parent, old);
      insert(parent, container, null);

      replace(old, current, container);

      expect(ref).toHaveBeenCalledTimes(1);
      expect(ref).toHaveBeenCalledWith(null);
    });

    it('mounts fiber inside container', () => {
      const parent = fiber('parent');
      const previous = makeElementFiber('previous');
      const current = makeElementFiber('current');
      const old = makeElementFiber('old');
      const next = makeElementFiber('next');
      const container = document.createElement('div');
      mark(previous, parent, null);
      mark(old, parent, previous);
      mark(next, parent, old);
      insert(parent, container, null);

      replace(old, current, container);

      expect(Array.from(container.childNodes)).toEqual([previous.dom, current.dom, next.dom]);
    });

    it("removes old fiber's dom", () => {
      const parent = fiber('parent');
      const previous = makeElementFiber('previous');
      const current = makeElementFiber('current');
      const old = makeElementFiber('old');
      const next = makeElementFiber('next');
      const container = document.createElement('div');
      mark(previous, parent, null);
      mark(old, parent, previous);
      mark(next, parent, old);
      insert(parent, container, null);

      replace(old, current, container);

      expect(Array.from(container.childNodes)).not.toContain(old.dom);
    });
  });
});
