import { fiber } from '../../src/fiber';
import { mark } from '../../src/fiber/mark';
import { getContainer } from '../../src/fiber/get-container';
import { createElement } from '../../src/jsx2';

describe('getContainer', () => {
  function makeElementFiber(tag: string) {
    const f = fiber(createElement(tag));
    f.dom = document.createElement(tag);
    return f;
  }

  describe('grandparent has no dom', () => {
    describe('parent has no dom', () => {
      it('returns null if fiber has no dom', () => {
        const grandparent = fiber('grandparent');
        const parent = fiber('parent');
        const current = fiber('current');
        mark(parent, grandparent, null);
        mark(current, parent, null);

        expect(getContainer(current)).toBe(null);
      });

      it('returns current dom if fiber has dom', () => {
        const grandparent = fiber('grandparent');
        const parent = fiber('parent');
        const current = makeElementFiber('current');
        mark(parent, grandparent, null);
        mark(current, parent, null);

        expect(getContainer(current)).toBe(current.dom);
      });
    });

    describe('parent has dom', () => {
      it("returns parent's dom if fiber has no dom", () => {
        const grandparent = fiber('grandparent');
        const parent = makeElementFiber('parent');
        const current = fiber('current');
        mark(parent, grandparent, null);
        mark(current, parent, null);

        expect(getContainer(current)).toBe(parent.dom);
      });

      it('returns current dom if fiber has dom', () => {
        const grandparent = fiber('grandparent');
        const parent = makeElementFiber('parent');
        const current = makeElementFiber('current');
        mark(parent, grandparent, null);
        mark(current, parent, null);

        expect(getContainer(current)).toBe(current.dom);
      });
    });
  });

  describe('grandparent has dom', () => {
    describe('parent has no dom', () => {
      it("returns grandparent's dom if fiber has no dom", () => {
        const grandparent = makeElementFiber('grandparent');
        const parent = fiber('parent');
        const current = fiber('current');
        mark(parent, grandparent, null);
        mark(current, parent, null);

        expect(getContainer(current)).toBe(grandparent.dom);
      });

      it('returns current dom if fiber has dom', () => {
        const grandparent = makeElementFiber('grandparent');
        const parent = fiber('parent');
        const current = makeElementFiber('current');
        mark(parent, grandparent, null);
        mark(current, parent, null);

        expect(getContainer(current)).toBe(current.dom);
      });
    });

    describe('parent has dom', () => {
      it("returns parent's dom if fiber has no dom", () => {
        const grandparent = makeElementFiber('grandparent');
        const parent = makeElementFiber('parent');
        const current = fiber('current');
        mark(parent, grandparent, null);
        mark(current, parent, null);

        expect(getContainer(current)).toBe(parent.dom);
      });

      it('returns current dom if fiber has dom', () => {
        const grandparent = makeElementFiber('grandparent');
        const parent = makeElementFiber('parent');
        const current = makeElementFiber('current');
        mark(parent, grandparent, null);
        mark(current, parent, null);

        expect(getContainer(current)).toBe(current.dom);
      });
    });
  });
});
