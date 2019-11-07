import { fiber } from '../../src/fiber';
import { mark } from '../../src/fiber/mark';
import { createElement } from '../../src/jsx2';
import { remove } from '../../src/fiber/remove';
import { insert } from '../../src/fiber/insert';

describe('remove', () => {
  function makeElementFiber(tag: string) {
    const f = fiber(createElement(tag));
    f.dom = document.createElement(tag);
    return f;
  }

  describe('fiber without dom', () => {
    describe('without children', () => {
      describe('without previous sibling', () => {
        it('does not mutate container', () => {
          const root = makeElementFiber('root');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          insert(root, container, null);

          remove(current, root, null, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([sibling.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(current, root, null);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(null);
        });
      });

      describe('with previous sibling', () => {
        it('does not mutate container', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([previous.dom, sibling.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(null);
        });

        it('sets previousFiber.next to next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(sibling);
        });

        it('sets previousFiber.next to null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(null);
        });
      });
    });

    describe('with child', () => {
      describe('without previous sibling', () => {
        it("removes child fiber's dom", () => {
          const root = makeElementFiber('root');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          remove(current, root, null, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([sibling.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const current = fiber('current');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(child1, current, null);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(null);
        });
      });

      describe('with previous sibling', () => {
        it("removes child fiber's dom", () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([previous.dom, sibling.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(child1, current, null);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(null);
        });

        it('sets previousFiber.next to next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(sibling);
        });

        it('sets previousFiber.next to null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(child1, current, null);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(null);
        });
      });
    });

    describe('with children', () => {
      describe('without previous sibling', () => {
        it("removes multiple child fiber's dom", () => {
          const root = makeElementFiber('root');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          remove(current, root, null, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([sibling.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(sibling);
        });
      });

      describe('with previous sibling', () => {
        it("removes multiple child fiber's dom", () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([previous.dom, sibling.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(null);
        });

        it('sets previousFiber.next to next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(sibling);
        });

        it('sets previousFiber.next to null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = fiber('current');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(null);
        });
      });
    });
  });

  describe('fiber with dom', () => {
    describe('without children', () => {
      describe('without previous sibling', () => {
        it('does not mutate container', () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          insert(root, container, null);

          remove(current, root, null, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([sibling.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const container = document.createElement('div');
          mark(current, root, null);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(null);
        });
      });

      describe('with previous sibling', () => {
        it("removes fiber's dom", () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([previous.dom, sibling.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(null);
        });

        it('sets previousFiber.next to next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(sibling);
        });

        it('sets previousFiber.next to null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(null);
        });
      });
    });

    describe('with child', () => {
      describe('without previous sibling', () => {
        it("removes fiber's dom", () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          remove(current, root, null, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([sibling.dom]);
        });

        it("does not remove child fiber's dom from fiber's dom", () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          remove(current, root, null, root.dom!);

          expect(Array.from(current.dom!.childNodes)).toEqual([child1.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(child1, current, null);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(null);
        });
      });

      describe('with previous sibling', () => {
        it("removes fiber's dom", () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([previous.dom, sibling.dom]);
        });

        it("does not remove child fiber's dom from fiber's dom", () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(Array.from(current.dom!.childNodes)).toEqual([child1.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(child1, current, null);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(null);
        });

        it('sets previousFiber.next to next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(sibling);
        });

        it('sets previousFiber.next to null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const child1 = makeElementFiber('child1');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(child1, current, null);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(null);
        });
      });
    });

    describe('with children', () => {
      describe('without previous sibling', () => {
        it("removes fiber's dom", () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          remove(current, root, null, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([sibling.dom]);
        });

        it("does not remove child fiber's dom from fiber's dom", () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          remove(current, root, null, root.dom!);

          expect(Array.from(current.dom!.childNodes)).toEqual([child1.dom, child2.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(current, root, null);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          const next = remove(current, root, null, root.dom!);

          expect(next).toBe(sibling);
        });
      });

      describe('with previous sibling', () => {
        it("removes fiber's dom", () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(Array.from(container.childNodes)).toEqual([root.dom]);
          expect(Array.from(root.dom!.childNodes)).toEqual([previous.dom, sibling.dom]);
        });

        it("does not remove child fiber's dom from fiber's dom", () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(Array.from(current.dom!.childNodes)).toEqual([child1.dom, child2.dom]);
        });

        it('returns next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(sibling);
        });

        it('returns null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          const next = remove(current, root, previous, root.dom!);

          expect(next).toBe(null);
        });

        it('sets previousFiber.next to next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const sibling = makeElementFiber('sibling');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(sibling, root, current);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(sibling);
        });

        it('sets previousFiber.next to null if no next fiber', () => {
          const root = makeElementFiber('root');
          const previous = makeElementFiber('previous');
          const current = makeElementFiber('current');
          const child1 = makeElementFiber('child1');
          const child2 = makeElementFiber('child2');
          const container = document.createElement('div');
          mark(previous, root, null);
          mark(current, root, previous);
          mark(child1, current, null);
          mark(child2, current, child1);
          insert(root, container, null);

          remove(current, root, previous, root.dom!);

          expect(previous.next).toBe(null);
        });
      });
    });
  });
});
