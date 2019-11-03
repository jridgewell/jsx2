import { fiber } from '../../src/fiber';
import { mark } from '../../src/fiber/mark';
import { unmount } from '../../src/fiber/unmount';
import { createElement, Component } from '../../src/jsx2';

describe('unmount', () => {
  class C extends Component {
    render() {}
  }

  function makeComponentFiber() {
    return fiber(createElement(C, null));
  }

  function makeElementFiber(tag: string) {
    const f = fiber(createElement(tag));
    f.dom = document.createElement(tag);
    return f;
  }

  describe('fiber without ref', () => {
    describe('fiber without dom', () => {
      describe('without children', () => {
        it('does nothing', () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const next = makeElementFiber('next');
          next.ref = jest.fn();
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(next.ref).not.toHaveBeenCalled();
        });
      });

      describe('with child', () => {
        it("unmounts child's ref", () => {
          const parent = fiber('parent');
          const current = fiber('current');
          const child = makeElementFiber('child');
          const next = makeElementFiber('next');
          child.ref = jest.fn();
          next.ref = jest.fn();
          mark(child, current, null);
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(child.ref).toHaveBeenCalledTimes(1);
          expect(child.ref).toHaveBeenCalledWith(null);
          expect(next.ref).not.toHaveBeenCalled();
        });
      });
    });

    describe('fiber with dom', () => {
      describe('without children', () => {
        it('does nothing', () => {
          const parent = fiber('parent');
          const current = makeElementFiber('current');
          const next = makeElementFiber('next');
          next.ref = jest.fn();
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(next.ref).not.toHaveBeenCalled();
        });
      });

      describe('with child', () => {
        it("unmounts child's ref", () => {
          const parent = fiber('parent');
          const current = makeElementFiber('current');
          const child = makeElementFiber('child');
          const next = makeElementFiber('next');
          child.ref = jest.fn();
          next.ref = jest.fn();
          mark(child, current, null);
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(child.ref).toHaveBeenCalledTimes(1);
          expect(child.ref).toHaveBeenCalledWith(null);
          expect(next.ref).not.toHaveBeenCalled();
        });
      });
    });
  });


  describe('fiber with ref', () => {
    describe('fiber without dom', () => {
      describe('without children', () => {
        it('does nothing', () => {
          const parent = fiber('parent');
          const current = makeComponentFiber();
          const next = makeElementFiber('next');
          current.ref = jest.fn();
          next.ref = jest.fn();
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(current.ref).toHaveBeenCalledTimes(1);
          expect(current.ref).toHaveBeenCalledWith(null);
          expect(next.ref).not.toHaveBeenCalled();
        });
      });

      describe('with child', () => {
        it("unmounts child's ref", () => {
          const parent = fiber('parent');
          const current = makeComponentFiber();
          const child = makeElementFiber('child');
          const next = makeElementFiber('next');
          current.ref = jest.fn();
          child.ref = jest.fn();
          next.ref = jest.fn();
          mark(child, current, null);
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(current.ref).toHaveBeenCalledTimes(1);
          expect(current.ref).toHaveBeenCalledWith(null);
          expect(child.ref).toHaveBeenCalledTimes(1);
          expect(child.ref).toHaveBeenCalledWith(null);
          expect(next.ref).not.toHaveBeenCalled();
        });
      });
    });

    describe('fiber with dom', () => {
      describe('without children', () => {
        it('does nothing', () => {
          const parent = fiber('parent');
          const current = makeElementFiber('current');
          const next = makeElementFiber('next');
          current.ref = jest.fn();
          next.ref = jest.fn();
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(current.ref).toHaveBeenCalledTimes(1);
          expect(current.ref).toHaveBeenCalledWith(null);
          expect(next.ref).not.toHaveBeenCalled();
        });
      });

      describe('with child', () => {
        it("unmounts child's ref", () => {
          const parent = fiber('parent');
          const current = makeElementFiber('current');
          const child = makeElementFiber('child');
          const next = makeElementFiber('next');
          current.ref = jest.fn();
          child.ref = jest.fn();
          next.ref = jest.fn();
          mark(child, current, null);
          mark(current, parent, null);
          mark(next, parent, current);

          unmount(current);

          expect(current.ref).toHaveBeenCalledTimes(1);
          expect(current.ref).toHaveBeenCalledWith(null);
          expect(child.ref).toHaveBeenCalledTimes(1);
          expect(child.ref).toHaveBeenCalledWith(null);
          expect(next.ref).not.toHaveBeenCalled();
        });
      });
    });
  });
});
