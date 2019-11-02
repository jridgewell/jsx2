import { fiber } from '../../src/fiber';
import { mark } from '../../src/fiber/mark';
import { createElement } from '../../src/create-element';
import { mount } from '../../src/fiber/mount';
import { replace } from '../../src/fiber/replace';

describe('replace', () => {
  function makeElementFiber(tag: string) {
    const f = fiber(createElement(tag));
    f.dom = document.createElement(tag);
    return f;
  }

  describe('with null previous fiber', () => {
    describe('without next', () => {
      it("sets parent's child to fiber", () => {
        const parent = fiber('parent');
        const current = makeElementFiber('current');
        const old = makeElementFiber('old');
        const container = document.createElement('div');
        mark(old, parent, null);
        mount(parent, container, null);

        replace(old, current, parent, null, container);

        expect(parent.child).toBe(current);
      });

      it('mounts fiber inside container', () => {
        const parent = fiber('parent');
        const current = makeElementFiber('current');
        const old = makeElementFiber('old');
        const container = document.createElement('div');
        mark(old, parent, null);
        mount(parent, container, null);

        replace(old, current, parent, null, container);

        expect(Array.from(container.childNodes)).toContain(current.dom);
      });

      it("removes old fiber's dom", () => {
        const parent = fiber('parent');
        const current = makeElementFiber('current');
        const old = makeElementFiber('old');
        const container = document.createElement('div');
        mark(old, parent, null);
        mount(parent, container, null);

        replace(old, current, parent, null, container);

        expect(Array.from(container.childNodes)).not.toContain(old.dom);
      });
    });

    describe('with next dom', () => {
      it("sets parent's child to fiber", () => {
        const parent = fiber('parent');
        const current = makeElementFiber('current');
        const old = makeElementFiber('old');
        const next = makeElementFiber('next');
        const container = document.createElement('div');
        mark(old, parent, null);
        mark(next, parent, old);
        mount(parent, container, null);

        replace(old, current, parent, null, container);

        expect(parent.child).toBe(current);
      });

      it('mounts fiber inside container', () => {
        const parent = fiber('parent');
        const current = makeElementFiber('current');
        const old = makeElementFiber('old');
        const next = makeElementFiber('next');
        const container = document.createElement('div');
        mark(old, parent, null);
        mark(next, parent, old);
        mount(parent, container, null);

        replace(old, current, parent, null, container);

        expect(Array.from(container.childNodes)).toEqual([current.dom, next.dom]);
      });

      it("removes old fiber's dom", () => {
        const parent = fiber('parent');
        const current = makeElementFiber('current');
        const old = makeElementFiber('old');
        const next = makeElementFiber('next');
        const container = document.createElement('div');
        mark(old, parent, null);
        mark(next, parent, old);
        mount(parent, container, null);

        replace(old, current, parent, null, container);

        expect(Array.from(container.childNodes)).not.toContain(old.dom);
      });
    });
  });

  describe('with previous fiber', () => {
    describe('without next', () => {
      it("sets parent's child to fiber", () => {
        const parent = fiber('parent');
        const previous = makeElementFiber('previous');
        const current = makeElementFiber('current');
        const old = makeElementFiber('old');
        const container = document.createElement('div');
        mark(previous, parent, null);
        mark(old, parent, previous);
        mount(parent, container, null);

        replace(old, current, parent, null, container);

        expect(parent.child).toBe(current);
      });

      it('mounts fiber inside container', () => {
        const parent = fiber('parent');
        const previous = makeElementFiber('previous');
        const current = makeElementFiber('current');
        const old = makeElementFiber('old');
        const container = document.createElement('div');
        mark(previous, parent, null);
        mark(old, parent, previous);
        mount(parent, container, null);

        replace(old, current, parent, null, container);

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
        mount(parent, container, null);

        replace(old, current, parent, null, container);

        expect(Array.from(container.childNodes)).not.toContain(old.dom);
      });
    });

    describe('with next dom', () => {
      it("sets parent's child to fiber", () => {
        const parent = fiber('parent');
        const previous = makeElementFiber('previous');
        const current = makeElementFiber('current');
        const old = makeElementFiber('old');
        const next = makeElementFiber('next');
        const container = document.createElement('div');
        mark(previous, parent, null);
        mark(old, parent, previous);
        mark(next, parent, old);
        mount(parent, container, null);

        replace(old, current, parent, null, container);

        expect(parent.child).toBe(current);
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
        mount(parent, container, null);

        replace(old, current, parent, null, container);

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
        mount(parent, container, null);

        replace(old, current, parent, null, container);

        expect(Array.from(container.childNodes)).not.toContain(old.dom);
      });
    });
  });
});
